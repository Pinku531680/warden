package org.example.springbootbackend.controller;

import org.example.springbootbackend.entity.UserEntity;
import org.example.springbootbackend.repository.UserRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/cache")
@CrossOrigin(origins = "*") // Allows your React frontend dashboard to call this route cleanly
public class CacheController {

    // used for Cache Warming Redis with users data

    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_KEY_PREFIX = "warden:user:";

    public CacheController(UserRepository userRepository,
                           StringRedisTemplate redisTemplate,
                           ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testSingleRedisOperation() {
        System.out.println("[Cache Debug] Executing standalone single write/read verification...");
        Map<String, Object> response = new HashMap<>();
        String testKey = "warden:diagnostic:test_key";
        String testValue = "Connection Operational at timestamp " + System.currentTimeMillis();

        try {
            // 1. Test Standalone Write (with a short 5-minute eviction TTL window)
            redisTemplate.opsForValue().set(testKey, testValue, 5, TimeUnit.MINUTES);
            System.out.println(">> Standalone write operation succeeded.");

            // 2. Test Standalone Read
            String fetchedValue = redisTemplate.opsForValue().get(testKey);
            System.out.println(">> Standalone read operation succeeded: " + fetchedValue);

            response.put("status", "SUCCESS");
            response.put("message", "Successfully authenticated and connected to Redis Cloud!");
            response.put("written_value", testValue);
            response.put("fetched_value", fetchedValue);
            return ResponseEntity.ok(response);

        } catch (Exception fault) {
            System.err.println("[Cache Debug] Standalone verification failed completely!");
            System.out.println(fault);

            response.put("status", "FAILED");
            response.put("error_type", fault.getClass().getName());
            response.put("error_message", fault.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/clear")
    public ResponseEntity<Map<String, Object>> clearUserCache() {
        System.out.println("[Cache Management] Initializing clean flush for all user cache keys...");
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Scan for all keys matching our targeted prefix pattern
            Set<String> targetKeys = redisTemplate.keys(CACHE_KEY_PREFIX + "*");
            int deletedCount = 0;

            // 2. Perform bulk deletion if keys are active
            if (targetKeys != null && !targetKeys.isEmpty()) {
                deletedCount = targetKeys.size();
                redisTemplate.delete(targetKeys);
            }

            System.out.printf("Cache Flush Complete: Removed %d profile keys from Redis Cloud.\n", deletedCount);
            System.out.println("-".repeat(50));

            response.put("status", "SUCCESS");
            response.put("message", "Successfully flushed all user profile states from Redis cache.");
            response.put("purged_keys_count", deletedCount);
            return ResponseEntity.ok(response);

        } catch (Exception fault) {
            System.err.println("Failed to clear user keys from Redis cache space: " + fault.getMessage());
            response.put("status", "FAILED");
            response.put("error_message", fault.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/warmup")
    public ResponseEntity<Map<String, Object>> warmUpUserCache() {
        System.out.println("[Cache Management] Launching high-performance Pipelined Cache Warming...");

        List<UserEntity> allUsers = userRepository.findAll();
        if (allUsers.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "FAILED");
            errorResponse.put("message", "PostgreSQL users_data table is empty. Please seed users first.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        int totalUsers = allUsers.size();
        int chunkPartitionSize = 1000; // Efficient chunk size to optimize network packets
        final int[] cachedCount = {0};
        int skippedCount = 0;

        // REALISTIC RANDOM DISTRIBUTION BUILDER
        // We track randomized targets in an effectively final Set so our inner
        // anonymous SessionCallback class can query it efficiently without compilation faults.
        final Set<Integer> coldUserIdsToSkip = new HashSet<>();

        List<Integer> dynamicShuffleIndices = new ArrayList<>();
        for (int i = 0; i < totalUsers; i++) {
            dynamicShuffleIndices.add(i);
        }
        Collections.shuffle(dynamicShuffleIndices);

        // Calculate exactly 1% target quota capacity bounds (e.g., 80 unique users out of 8,000)
        int exactSkipTargetLimit = totalUsers / 100;
        for (int i = 0; i < exactSkipTargetLimit; i++) {
            int randomTargetIndex = dynamicShuffleIndices.get(i);
            coldUserIdsToSkip.add(allUsers.get(randomTargetIndex).getUserId());
        }


        // Process the entire collection using memory-safe batch partitions
        for (int i = 0; i < totalUsers; i += chunkPartitionSize) {
            int endWindow = Math.min(i + chunkPartitionSize, totalUsers);
            List<UserEntity> subBatchList = allUsers.subList(i, endWindow);

            final int currentIndexOffset = i;

            // Open a high-throughput pipeline stream context down the connection socket
            redisTemplate.executePipelined(new SessionCallback<Object>() {
                @Override
                public Object execute(RedisOperations operations) throws DataAccessException {
                    // Safe type cast back to our core string template context signatures
                    RedisOperations<String, String> stringOps = (RedisOperations<String, String>) operations;

                    for (int j = 0; j < subBatchList.size(); j++) {
                        int actualGlobalIndex = currentIndexOffset + j;
                        UserEntity user = subBatchList.get(j);
                        String cacheKey = CACHE_KEY_PREFIX + user.getUserId();

                        // INTENTIONAL COLD MISSES (1% Rate Skip Layout Validation)
                        if (coldUserIdsToSkip.contains(user.getUserId())) {
                            System.out.println("Skipping coldUserId: " + user.getUserId());
                            stringOps.delete(cacheKey);
                        } else {
                            try {
                                String jsonProfile = objectMapper.writeValueAsString(user);

                                // FIXED: Removed expiration time bounds to store records permanently
                                stringOps.opsForValue().set(cacheKey, jsonProfile);
//                                cachedCount[0]++;
                            } catch (Exception fault) {
                                // Gracefully capture individual serialization formatting issues
                            }
                        }
                    }
                    return null; // The pipeline captures responses collectively at execution termination
                }
            });

            // Adjust counting bounds for metric compilation feedback
            for (int k = 0; k < subBatchList.size(); k++) {
                if ((currentIndexOffset + k) % 100 == 0) skippedCount++;
                else cachedCount[0]++;
            }

            System.out.printf(">> Flushed pipeline package chunk window: %d to %d records successfully.\n", i, endWindow);
        }

        System.out.printf("Pipelined Cache Warming Finalized: %d cached, %d left cold.\n", cachedCount[0], skippedCount);
        System.out.println("-".repeat(50));

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("total_database_profiles", totalUsers);
        response.put("successfully_cached", cachedCount[0]);
        response.put("deliberately_skipped_cold", skippedCount);
        response.put("simulated_cache_miss_rate", "1.00 %");

        return ResponseEntity.ok(response);
    }
}