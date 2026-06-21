package org.example.springbootbackend.services;

import org.example.springbootbackend.config.RabbitMQConfig;
import org.example.springbootbackend.controller.LiveSimulationWebSocketHandler;
import org.example.springbootbackend.entity.TransactionEntity;
import org.example.springbootbackend.entity.UserEntity;
import org.example.springbootbackend.model.proto.LiveInferenceEventProto;
import org.example.springbootbackend.model.proto.LiveTransactionEventProto;
import org.example.springbootbackend.repository.TransactionProductionRepository;
import org.example.springbootbackend.repository.UserRepository;
import org.example.springbootbackend.utilities.FeatureEngineeringEngine;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;

import java.net.http.WebSocket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class TransactionLiveSimulationService {

    private final TransactionProductionRepository transactionProductionRepository;
    private final UserRepository userRepository;
    private final FeatureEngineeringEngine featureEngineeringEngine;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final RabbitTemplate rabbitTemplate;

    private static final String USER_CACHE_PREFIX = "warden:user:";
    private static final String TXN_STATUS_PREFIX = "warden:txn:status:";


    public TransactionLiveSimulationService(
            TransactionProductionRepository transactionProductionRepository,
            UserRepository userRepository,
            FeatureEngineeringEngine featureEngineeringEngine,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper,
            RabbitTemplate rabbitTemplate) {
        this.transactionProductionRepository = transactionProductionRepository;
        this.userRepository = userRepository;
        this.featureEngineeringEngine = featureEngineeringEngine;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public void processLiveSimulationEventStream(List<LiveTransactionEventProto> protoPayload, String clientId) {
        long startTime = System.currentTimeMillis();

        // Resolve active WebSocket Session context handle
        WebSocketSession activeSession = LiveSimulationWebSocketHandler.getSessionsRegistry().get(clientId);


        // GUARANTEED SAFE IDEMPOTENCY KEY VECTORIZATION FILTER (NEW)
        List<String> idempotencyCheckKeys = protoPayload.stream()
                .map(p -> TXN_STATUS_PREFIX + p.getTxnId())
                .collect(Collectors.toList());

        List<String> existingStatuses = redisTemplate.opsForValue().multiGet(idempotencyCheckKeys);

        List<LiveTransactionEventProto> completelyUniquePayloads = new ArrayList<>();

        for (int i = 0; i < protoPayload.size(); i++) {
            LiveTransactionEventProto proto = protoPayload.get(i);
            String existingStatus = (existingStatuses != null && i < existingStatuses.size()) ? existingStatuses.get(i) : null;

            if (existingStatus != null) {
                // FAILURE CONDITION: Deduplication or Retry intercepted
                // In either cases, immediately send response back to frontend
                // But for retries, where results have been processed, so Redis has status "APPROVED/REJECTED"
                // Get the row from Postgres and send to frontend
                System.out.printf("🛑 [Idempotency Guard] Intercepted duplicated/retried transaction signature ID: %s.\n", proto.getTxnId().substring(0, 5));

                if (activeSession != null && activeSession.isOpen()) {
                    try {
                        Map<String, Object> duplicatePayload = new HashMap<>();
                        duplicatePayload.put("type", "DUPLICATE_TXN");
                        duplicatePayload.put("txnId", proto.getTxnId());
                        duplicatePayload.put("userId", proto.getUserId());
                        duplicatePayload.put("txnAmt", proto.getTxnAmt());
                        duplicatePayload.put("merchantType", proto.getMerchantType());
                        duplicatePayload.put("status", "DUPLICATE_TXN");
                        duplicatePayload.put("fraudScore", 0.00f);

                        activeSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(duplicatePayload)));
                    } catch (Exception fault) {
                        System.err.println("Failed to stream duplicate frame warning downstream: " + fault.getMessage());
                    }
                }
            } else {
                // PASS CONDITION: Transaction signature is distinct and unique
                completelyUniquePayloads.add(proto);
            }
        }

        // Exit immediately if the incoming block batch consisted entirely of duplicated retry loops
        if (completelyUniquePayloads.isEmpty()) {
            return;
        }

        // STAGE 1: HIGH-PERFORMANCE VECTORIZED BULK CACHE LOOKUP (multiGet)
        Map<Integer, UserEntity> userProfileMap = new HashMap<>();

        List<Integer> distinctUserIds = protoPayload.stream()
                .map(LiveTransactionEventProto::getUserId)
                .distinct()
                .collect(Collectors.toList());

        List<String> redisKeys = distinctUserIds.stream()
                .map(id -> USER_CACHE_PREFIX + id)
                .collect(Collectors.toList());

        // Pull all user JSON rows in exactly 1 single network round-trip call
        List<String> cachedJsons = redisTemplate.opsForValue().multiGet(redisKeys);

        if (cachedJsons != null) {
            for (int i = 0; i < distinctUserIds.size(); i++) {
                Integer userId = distinctUserIds.get(i);
                String json = i < cachedJsons.size() ? cachedJsons.get(i) : null;

                if (json != null && !json.isEmpty()) {
                    try {
                        UserEntity profile = objectMapper.readValue(json, UserEntity.class);
                        userProfileMap.put(userId, profile);
                    } catch (Exception ignored) {}
                }
            }
        }


        // STAGE 2: BATCH RELATIONAL FALLBACK FOR COLD CACHE MISSES (findAllById)
        List<Integer> missingUserIds = distinctUserIds.stream()
                .filter(id -> !userProfileMap.containsKey(id))
                .collect(Collectors.toList());

        if (!missingUserIds.isEmpty()) {

            //Stream precise trace logs back down to the UI right before dropping down to Postgres
            if (activeSession != null && activeSession.isOpen()) {
                try {
                    for (Integer missingId : missingUserIds) {
                        String missAlertMsg = String.format("{\"type\":\"REDIS_CACHE_MISS\",\"userId\":%d}", missingId);
                        activeSession.sendMessage(new TextMessage(missAlertMsg));
                    }
                } catch (Exception err) {
                    System.err.println("Failed to broadcast cache miss metadata alerts: " + err.getMessage());
                }
            }

            System.out.printf("[Cache Miss Vector] Look up %d profiles from PostgreSQL in a single batch...\n", missingUserIds.size());
            List<UserEntity> dbProfiles = userRepository.findAllById(missingUserIds);
            for (UserEntity profile : dbProfiles) {
                userProfileMap.put(profile.getUserId(), profile);
            }

            // Handle fallbacks for unregistered users if any anomalies occur
            for (Integer id : missingUserIds) {
                if (!userProfileMap.containsKey(id)) {
                    UserEntity fallback = new UserEntity();
                    fallback.setUserId(id);
                    fallback.setAccType("STANDARD");
                    fallback.setAccAge(12);
                    fallback.setFlaggedTxns(0);
                    fallback.setMeanTxn30d(200);
                    fallback.setStdDevTxn(50);
                    fallback.setPrimaryDeviceId("UNKNOWN");
                    userProfileMap.put(id, fallback);
                }
            }
        }

        List<TransactionEntity> liveAuditEntities = protoPayload.stream().map(proto -> {
            TransactionEntity entity = new TransactionEntity();

            // 1. Map raw transaction criteria passed directly from the client application
            entity.setTxnId(proto.getTxnId());
            entity.setUserId(proto.getUserId());
            entity.setTxnAmt(proto.getTxnAmt());
            entity.setTxnTimeUTC(proto.getTxnTimeUTC());
            entity.setTxnTimeLocalHour(proto.getTxnTimeLocalHour());
            entity.setTxnLat(proto.getTxnLat());
            entity.setTxnLon(proto.getTxnLon());
            entity.setTxnCountry(proto.getTxnCountry());
            entity.setMerchantType(proto.getMerchantType());
            entity.setDeviceId(proto.getDeviceId());
            entity.setClientId(clientId); // Set active socket token context

            // Instant index retrieval from local memory map
            UserEntity userProfile = userProfileMap.get(proto.getUserId());

            // HYDRATE TRANSACTION CONTEXT ATTRIBUTES
            entity.setAccType(userProfile.getAccType());
            entity.setAccAge(userProfile.getAccAge());
            entity.setFlaggedTxns(userProfile.getFlaggedTxns());

            // LIVE INFERENCE VERDICT TRACKING INITIALIZATION
            entity.setFraudScore(0.0f);
            entity.setStatus("PENDING");

            // RUN DYNAMIC  REAL-TIME FEATURE ENGINEERING ENGINE
            featureEngineeringEngine.enrichWithEngineeredFeatures(entity, userProfile);

            // Put txnId in Redis with status "PENDING" and TTL of 5 mins
            //redisTemplate.opsForValue().set(TXN_STATUS_PREFIX + entity.getTxnId(), "PENDING", 5, TimeUnit.MINUTES);

            return entity;
        }).collect(Collectors.toList());

        // Batch persist the live audit trails to transactions_production
        transactionProductionRepository.saveAll(liveAuditEntities);

        long durationPostgres = System.currentTimeMillis() - startTime;
        System.out.printf("Saved " + liveAuditEntities.size() + " txn objs in transactions_production in %d ms\n", durationPostgres);

        // IMMEDIATE DATABASE PERSISTENCE ACKNOWLEDGEMENT (TXN_ACK)
        // If saved to Postgres, we can guarantee that the req will be processed
        if (activeSession != null && activeSession.isOpen()) {
            try {
                for (TransactionEntity entity : liveAuditEntities) {
                    Map<String, Object> ackPayload = new HashMap<>();
                    ackPayload.put("type", "TXN_ACK");
                    ackPayload.put("txnId", entity.getTxnId());
                    ackPayload.put("userId", entity.getUserId());
                    ackPayload.put("status", "INGESTED");

                    activeSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(ackPayload)));
                }
            } catch (Exception fault) {
                System.err.println("Critical failure emitting database ingestion ACKs downstream: " + fault.getMessage());
            }
        }


        // STAGE 4: PIPELINED ASYNC REDIS IDEMPOTENCY REGISTRATION
        // Send all keys down the socket pipeline buffer asynchronously in 1 pass
        redisTemplate.executePipelined(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations operations) throws DataAccessException {
                for (TransactionEntity entity : liveAuditEntities) {
                    operations.opsForValue().set(TXN_STATUS_PREFIX + entity.getTxnId(), "PENDING", 5, TimeUnit.MINUTES);
                }
                return null;
            }
        });
//        redisTemplate.executePipelined(new RedisCallback<Object>() {
//            @Override
//            public Object doInRedis(RedisConnection connection) throws DataAccessException {
//                // Access raw string serialization if using StringRedisTemplate
//                // Alternatively, use redisTemplate.getKeySerializer() / getValueSerializer()
//
//                for (TransactionEntity entity : liveAuditEntities) {
//                    byte[] key = (TXN_STATUS_PREFIX + entity.getTxnId()).getBytes();
//                    byte[] value = "PENDING".getBytes();
//
//                    // Execute set with an expiration (5 minutes = 300 seconds)
//                    connection.stringCommands().setEx(key, 300, value);
//                }
//                return null; // Must return null inside executePipelined
//            }
//        });

        long durationRedis = System.currentTimeMillis() - startTime;
        System.out.printf("<<[Warden Core] Records saved to Redis in %d ms.\n", durationRedis);

        // STAGE 5: HIGH PERF PINNED CHANNEL AMQP EMISSION
        // invoke() pins a single AMQP channel for the entire batch execution block,
        // completely eliminating channel checkout/checkin lifecycle overhead.
        rabbitTemplate.invoke(operations -> {
            for (TransactionEntity entity : liveAuditEntities) {
                LiveInferenceEventProto inferenceMessage = LiveInferenceEventProto.newBuilder()
                        .setTxnId(entity.getTxnId())
                        .setTxnAmt(entity.getTxnAmt())
                        .setAccType(entity.getAccType())
                        .setAccAge(entity.getAccAge())
                        .setFlaggedTxns(entity.getFlaggedTxns())
                        .setMerchantType(entity.getMerchantType())
                        .setGeoCountryMismatch(entity.isGeoCountryMismatch())
                        .setGeoDistanceKm(entity.getGeoDistanceKm())
                        .setTimeGapLastTxn(entity.getTimeGapLastTxn())
                        .setIsAbnormalTime(entity.isAbnormalTime())
                        .setHighTxnVelocity(entity.isHighTxnVelocity())
                        .setUserAtvDelta(entity.getUserAtvDelta())
                        .setIsNewDevice(entity.isNewDevice())
                        .setSpeedKmh(entity.getSpeedKmh())
                        .setFraudScore(entity.getFraudScore())
                        .setStatus(entity.getStatus())
                        .setClientId(entity.getClientId())
                        .build();

                // Push raw byte payload directly to RabbitMQ queue channel
                // These are fields required for inference, we don't need others
                operations.convertAndSend(RabbitMQConfig.SIMULATION_INFERENCE_QUEUE, inferenceMessage.toByteArray());
            }

            return null;
        });


        long duration = System.currentTimeMillis() - startTime;
        System.out.printf("<<[Warden Core] Micro-batch of %d records engineered and propagated to MQ in %d ms\n",
                liveAuditEntities.size(), duration);
    }

}
