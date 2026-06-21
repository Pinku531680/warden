package org.example.springbootbackend.services;

import org.example.springbootbackend.config.RabbitMQConfig;
import org.example.springbootbackend.controller.LiveSimulationWebSocketHandler;
import org.example.springbootbackend.entity.TransactionEntity;
import org.example.springbootbackend.model.proto.LiveInferenceEventProto;
import org.example.springbootbackend.repository.TransactionProductionRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionWatchdogService {

    private final TransactionProductionRepository productionRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public TransactionWatchdogService(TransactionProductionRepository productionRepository,
                                      RabbitTemplate rabbitTemplate,
                                      ObjectMapper objectMapper) {
        this.productionRepository = productionRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * WARDEN SERVER-SIDE RECOVERY Sweeper:
     * Wakes up every 15 seconds to pulse health traces and recover stuck messages.
     */
    @Scheduled(fixedRate = 15000)
    public void executeStaleTransactionRecoverySweep() {


        // CHEAP GLOBAL HEARTBEAT BROADCAST
        // Broadcast a single system pulse trace to ALL open sessions unconditionally
        Map<String, WebSocketSession> activeSessions = LiveSimulationWebSocketHandler.getSessionsRegistry();

        if(activeSessions.isEmpty()) return;

        if (!activeSessions.isEmpty()) {
            try {
                Map<String, Object> diagnosticPulse = new HashMap<>();
                diagnosticPulse.put("type", "WATCHDOG_RUNNING");
                diagnosticPulse.put("status", "ACTIVE_CRON_SWEEP");

                TextMessage pulseFrame = new TextMessage(objectMapper.writeValueAsString(diagnosticPulse));

                for (WebSocketSession session : activeSessions.values()) {
                    if (session != null && session.isOpen()) {
                        session.sendMessage(pulseFrame); // Broadcast out safely
                    }
                }
            } catch (Exception fault) {
                System.err.println("Failed to emit global watchdog telemetry heartbeat: " + fault.getMessage());
            }
        }

        // SILENT BACKEND DATA PLANE RECOVERY
        // Safely scan and re-queue stuck records to RabbitMQ without telling the UI
        LocalDateTime ageThresholdCutoff = LocalDateTime.now().minusSeconds(15);
        List<TransactionEntity> staleTransactions = productionRepository
                .findByStatusAndInsertedAtBefore("PENDING", ageThresholdCutoff);

        System.out.printf("[Watchdog Service] Captured %d unacknowledged records stuck in PENDING. Executing recovery...\n",
                staleTransactions.size());

        if (staleTransactions.isEmpty()) {
            return; // System perfectly synchronized; exit early
        }

        // Stream elements into the inference pool using high-performance pinned channel allocation
        rabbitTemplate.invoke(operations -> {
            for (TransactionEntity entity : staleTransactions) {
                LiveInferenceEventProto messagePayload = LiveInferenceEventProto.newBuilder()
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

                operations.convertAndSend(RabbitMQConfig.SIMULATION_INFERENCE_QUEUE, messagePayload.toByteArray());
            }
            return null;
        });

        System.out.printf("[Watchdog Service] Quietly re-queued %d records back into the message broker channel layers.\n", staleTransactions.size());
    }
}

