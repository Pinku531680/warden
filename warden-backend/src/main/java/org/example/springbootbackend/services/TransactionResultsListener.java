package org.example.springbootbackend.services;

import org.example.springbootbackend.config.RabbitMQConfig;
import org.example.springbootbackend.entity.TransactionEntity;
import org.example.springbootbackend.model.proto.LiveInferenceEventProto;
import org.example.springbootbackend.repository.TransactionProductionRepository;
import org.example.springbootbackend.controller.LiveSimulationWebSocketHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class TransactionResultsListener {

    private final TransactionProductionRepository productionRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String TXN_STATUS_PREFIX = "warden:txn:status:";

    public TransactionResultsListener(TransactionProductionRepository productionRepository,
                                      StringRedisTemplate redisTemplate,
                                      ObjectMapper objectMapper) {
        this.productionRepository = productionRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }
    // Inside TransactionResultsListener.java -> Replace the master method block:

    @RabbitListener(
            queues = RabbitMQConfig.SIMULATION_RESULTS_QUEUE,
            containerFactory = "rabbitListenerContainerFactory" // Binds to standard non-batch factory
    )
    public void receiveSingleInferenceResult(byte[] messageBytes) {
        try {
            LiveInferenceEventProto proto = LiveInferenceEventProto.parseFrom(messageBytes);
            String txnId = proto.getTxnId();
            float score = proto.getFraudScore();
            String targetClientId = proto.getClientId();

            // Fetch the individual record to update
            java.util.Optional<TransactionEntity> recordOpt = productionRepository.findById(txnId);

            Map<String, Object> visualBroadcastMap = new HashMap<>();
            visualBroadcastMap.put("txnId", txnId);
            visualBroadcastMap.put("clientId", targetClientId);
            visualBroadcastMap.put("accType", proto.getAccType());
            visualBroadcastMap.put("accAge", proto.getAccAge());
            visualBroadcastMap.put("flaggedTxns", proto.getFlaggedTxns());
            visualBroadcastMap.put("txnAmt", proto.getTxnAmt());
            visualBroadcastMap.put("merchantType", proto.getMerchantType());
            visualBroadcastMap.put("geoCountryMismatch", proto.getGeoCountryMismatch());
            visualBroadcastMap.put("geoDistanceKm", proto.getGeoDistanceKm());
            visualBroadcastMap.put("speedKmh", proto.getSpeedKmh());
            visualBroadcastMap.put("timeGapLastTxn", proto.getTimeGapLastTxn());
            visualBroadcastMap.put("highTxnVelocity", proto.getHighTxnVelocity());
            visualBroadcastMap.put("userAtvDelta", proto.getUserAtvDelta());
            visualBroadcastMap.put("isNewDevice", proto.getIsNewDevice());
            visualBroadcastMap.put("isAbnormalTime", proto.getIsAbnormalTime());

            String decisionStatus = (score >= 0.80f) ? "REJECTED" : "APPROVED";
            String operationalType = (score >= 0.80f) ? "REJECTED_TXN" : "APPROVED_TXN";

            if (recordOpt.isPresent()) {
                TransactionEntity auditRecord = recordOpt.get();

                // If it's already processed, treat as duplicate alert
                if (!"PENDING".equalsIgnoreCase(auditRecord.getStatus())) {
                    visualBroadcastMap.put("type", "DUPLICATE_TXN");
                    visualBroadcastMap.put("status", "DUPLICATE_TXN");
                    visualBroadcastMap.put("fraudScore", auditRecord.getFraudScore());
                } else {
                    auditRecord.setFraudScore(score);
                    auditRecord.setStatus(decisionStatus);
                    productionRepository.save(auditRecord); // Direct immediate save

                    // Also update Redis immediately
                    redisTemplate.opsForValue().set("warden:txn:status:" + txnId, decisionStatus, 5, TimeUnit.MINUTES);

                    visualBroadcastMap.put("type", operationalType);
                    visualBroadcastMap.put("status", operationalType);
                    visualBroadcastMap.put("fraudScore", score);
                }
            }

            // Push down the WebSocket channel instantly
            WebSocketSession activeSession = LiveSimulationWebSocketHandler.getSessionsRegistry().get(targetClientId);
            if (activeSession != null && activeSession.isOpen()) {
                activeSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(visualBroadcastMap)));
            }

        } catch (Exception fault) {
            System.err.println("Error processing immediate response frame: " + fault.getMessage());
        }
    }

//    @RabbitListener(queues = RabbitMQConfig.SIMULATION_RESULTS_QUEUE)
//    public void receiveInferenceResultsPayload(List<byte[]> messagesBatchBytes) {
//        long batchStartTime = System.currentTimeMillis();
//        System.out.printf(">>[Results Listener] Pulled batch allocation of %d entries from RabbitMQ...\n", messagesBatchBytes.size());
//
//        List<LiveInferenceEventProto> parsedProtos = new ArrayList<>();
//        List<String> txnIds = new ArrayList<>();
//
//        // 1. Bulk deserialize the incoming binary frames
//        for (byte[] bytes : messagesBatchBytes) {
//            try {
//                LiveInferenceEventProto proto = LiveInferenceEventProto.parseFrom(bytes);
//                parsedProtos.add(proto);
//                txnIds.add(proto.getTxnId());
//            } catch (Exception fault) {
//                System.err.println("Failed decoding Protobuf result packet: " + fault.getMessage());
//            }
//        }
//
//        // 2. VECTORIZED FETCH: Load all target audit entries from PostgreSQL in exactly 1 single hit
//        List<TransactionEntity> dbRecords = productionRepository.findAllById(txnIds);
//        Map<String, TransactionEntity> recordLookupMap = dbRecords.stream()
//                .collect(Collectors.toMap(TransactionEntity::getTxnId, r -> r));
//
//        List<TransactionEntity> entitiesToSave = new ArrayList<>();
//        List<Map<String, Object>> wsBroadcastPayloads = new ArrayList<>();
//
//        // 3. Process processing transitions in-memory
//        for (LiveInferenceEventProto proto : parsedProtos) {
//            String txnId = proto.getTxnId();
//            float score = proto.getFraudScore();
//            String targetClientId = proto.getClientId();
//
//            TransactionEntity auditRecord = recordLookupMap.get(txnId);
//
//            Map<String, Object> visualBroadcastMap = new HashMap<>();
//            visualBroadcastMap.put("txnId", txnId);
//            visualBroadcastMap.put("clientId", targetClientId);
//            visualBroadcastMap.put("accType", proto.getAccType());
//            visualBroadcastMap.put("accAge", proto.getAccAge());
//            visualBroadcastMap.put("flaggedTxns", proto.getFlaggedTxns());
//            visualBroadcastMap.put("txnAmt", proto.getTxnAmt());
//            visualBroadcastMap.put("merchantType", proto.getMerchantType());
//            visualBroadcastMap.put("geoCountryMismatch", proto.getGeoCountryMismatch());
//            visualBroadcastMap.put("geoDistanceKm", proto.getGeoDistanceKm());
//            visualBroadcastMap.put("speedKmh", proto.getSpeedKmh());
//            visualBroadcastMap.put("timeGapLastTxn", proto.getTimeGapLastTxn());
//            visualBroadcastMap.put("highTxnVelocity", proto.getHighTxnVelocity());
//            visualBroadcastMap.put("userAtvDelta", proto.getUserAtvDelta());
//            visualBroadcastMap.put("isNewDevice", proto.getIsNewDevice());
//            visualBroadcastMap.put("isAbnormalTime", proto.getIsAbnormalTime());
//
//            // Deduplication Guard Evaluation Check
//            // If status not "PENDING", the TXN has already been processed, or RE-QUEUED
//            if (auditRecord != null && !"PENDING".equalsIgnoreCase(auditRecord.getStatus())) {
//                visualBroadcastMap.put("type", "DUPLICATE_TXN");
//                visualBroadcastMap.put("status", "DUPLICATE_TXN");
//                visualBroadcastMap.put("fraudScore", auditRecord.getFraudScore());
//                wsBroadcastPayloads.add(visualBroadcastMap);
//                continue;
//            }
//
//            String decisionStatus = (score >= 0.80f) ? "REJECTED" : "APPROVED";
//            String operationalType = (score >= 0.80f) ? "REJECTED_TXN" : "APPROVED_TXN";
//
//            if (auditRecord != null) {
//                auditRecord.setFraudScore(score);
//                auditRecord.setStatus(decisionStatus);
//                entitiesToSave.add(auditRecord);
//            }
//
//            visualBroadcastMap.put("type", operationalType);
//            visualBroadcastMap.put("status", operationalType);
//            visualBroadcastMap.put("fraudScore", score);
//            wsBroadcastPayloads.add(visualBroadcastMap);
//        }
//
//
//        // VECTORIZED WRITE 1: PostgreSQL Batch Save (saveAll)
//        if (!entitiesToSave.isEmpty()) {
//            productionRepository.saveAll(entitiesToSave);
//        }
//
//
//        // VECTORIZED WRITE 2: Redis Pipelined Lock Updates (executePipelined)
//        if (!entitiesToSave.isEmpty()) {
//            redisTemplate.executePipelined(new SessionCallback<Object>() {
//                @Override
//                public Object execute(RedisOperations operations) throws DataAccessException {
//                    for (TransactionEntity entity : entitiesToSave) {
//                        operations.opsForValue().set(TXN_STATUS_PREFIX + entity.getTxnId(), entity.getStatus(), 5, TimeUnit.MINUTES);
//                    }
//                    return null;
//                }
//            });
////            redisTemplate.executePipelined(new RedisCallback<Object>() {
////                @Override
////                public Object doInRedis(RedisConnection connection) throws DataAccessException {
////                    for (TransactionEntity entity : entitiesToSave) {
////                        byte[] key = (TXN_STATUS_PREFIX + entity.getTxnId()).getBytes();
////                        // Get the dynamic status string (e.g., "SUCCESS", "FAILED")
////                        byte[] value = entity.getStatus().getBytes();
////
////                        // 5 minutes = 300 seconds
////                        connection.stringCommands().setEx(key, 300, value);
////                    }
////                    return null;
////                }
////            });
//        }
//
//        // 4. Stream results back to WebSocket sessions registries safely
//        for (Map<String, Object> payload : wsBroadcastPayloads) {
//            String clientId = (String) payload.get("clientId");
//            WebSocketSession activeSession = LiveSimulationWebSocketHandler.getSessionsRegistry().get(clientId);
//            if (activeSession != null && activeSession.isOpen()) {
//                try {
//                    activeSession.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
//                } catch (Exception err) {
//                    System.err.println("Async context websocket transmit write crash: " + err.getMessage());
//                }
//            }
//        }
//
//        long processingDuration = System.currentTimeMillis() - batchStartTime;
//        System.out.printf("[Results Listener] Vectorized settlement pass for %d updates finished in %d ms.\n",
//                messagesBatchBytes.size(), processingDuration);
//    }
}
