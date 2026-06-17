package org.example.springbootbackend.controller;

// CRITICAL PROTOBUF & SERVICE IMPORTS
import org.example.springbootbackend.config.RabbitMQConfig;
import org.example.springbootbackend.model.proto.TransactionChunkEnvelopeProto;
import org.example.springbootbackend.services.TransactionTrainingIngestionService;

// CRITICAL SPRING WEBSOCKET IMPORTS (Resolves the red lines)
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

// CRITICAL CORE JAVA NIO UTILITIES
import java.nio.ByteBuffer;

@Component
public class TransactionWebSocketHandler extends BinaryWebSocketHandler {

    private final TransactionTrainingIngestionService trainingIngestionService;
    private final RabbitTemplate rabbitTemplate;

    public TransactionWebSocketHandler(TransactionTrainingIngestionService trainingIngestionService,
                                       RabbitTemplate rabbitTemplate) {
        this.trainingIngestionService = trainingIngestionService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        ByteBuffer byteBuffer = message.getPayload();
        byte[] rawBytes = new byte[byteBuffer.remaining()];
        byteBuffer.get(rawBytes);

        try {
            // Direct zero-copy binary decoding from the network buffer frame
            TransactionChunkEnvelopeProto envelope = TransactionChunkEnvelopeProto.parseFrom(rawBytes);

            if (envelope.getPayloadList() != null && !envelope.getPayloadList().isEmpty()) {
                // Pipe the unpacked Protobuf messages to the high-performance DB layer
                trainingIngestionService.saveProtoIngestedChunk(envelope.getPayloadList());
                System.out.println("Protobuf Ingestion Engine: Saved chunk window of "
                        + envelope.getChunkSize() + " records directly to Postgres.");
            }

            if (envelope.getIsLastChunk()) {

                System.out.println("Stream Completed! Entire simulation transaction dataset synchronized successfully.");

                // Send Message in MQ from where Python consumes the message
                // fetches data from Postgres itself, saves it to disk and then
                // trains the model
                // Construct a lightweight metadata instruction payload
                String triggerNotificationJson = "{"
                        + "\"status\":\"COMPLETED\","
                        + "\"targetTable\":\"transactions_training\","
                        + "\"timestamp\":" + System.currentTimeMillis()
                        + "}";

                // Fire the trigger event to RabbitMQ
                rabbitTemplate.convertAndSend(
                        RabbitMQConfig.TRAINING_EXCHANGE,
                        RabbitMQConfig.TRAINING_ROUTING_KEY,
                        triggerNotificationJson
                );

                System.out.println("Sent training orchestration trigger signal in queue: " + RabbitMQConfig.TRAINING_QUEUE);
            }
        } catch (Exception fault) {
            System.err.println("Critical failure deserializing inbound Protobuf binary payload: " + fault.getMessage());
            fault.printStackTrace();
        }
    }
}
