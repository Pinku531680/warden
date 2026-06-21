package org.example.springbootbackend.controller;

import org.example.springbootbackend.model.proto.LiveSimulationEnvelopeProto;
import org.example.springbootbackend.services.TransactionLiveSimulationService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LiveSimulationWebSocketHandler extends BinaryWebSocketHandler {

    private final TransactionLiveSimulationService liveSimulationService;

    // Global session directory allowing background listeners to map client IDs to socket contexts
    private static final Map<String, WebSocketSession> sessionsRegistry = new ConcurrentHashMap<>();

    public LiveSimulationWebSocketHandler(TransactionLiveSimulationService liveSimulationService) {
        this.liveSimulationService = liveSimulationService;
    }

    public static Map<String, WebSocketSession> getSessionsRegistry() {
        return sessionsRegistry;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String clientId = extractClientId(session);

        // FIXED: DECORATE SOCKET WITH CONCURRENT WRITE BUFFER FOR THREAD SAFETY
        // Parameters:
        //  1. The raw, standard connection session instance
        //  2. Send time limit threshold allocation (10 seconds / 10000 ms)
        //  3. Outbound memory frame buffer capacity scale (512 KB / 512 * 1024 bytes)
        // =========================================================================
        WebSocketSession threadSafeSession = new ConcurrentWebSocketSessionDecorator(
                session,
                10000,
                512 * 1024
        );

        sessionsRegistry.put(clientId, threadSafeSession);
        System.out.printf("[WS Gateway] Client connected. Thread-Safe Session Registered -> ID: %s\n", clientId);
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        ByteBuffer byteBuffer = message.getPayload();
        byte[] rawBytes = new byte[byteBuffer.remaining()];
        byteBuffer.get(rawBytes);

        String clientId = extractClientId(session);

        try {
            // Unpack raw payload boundaries using the live proto contract
            LiveSimulationEnvelopeProto envelope = LiveSimulationEnvelopeProto.parseFrom(rawBytes);

            if (envelope.getPayloadList() != null && !envelope.getPayloadList().isEmpty()) {
                liveSimulationService.processLiveSimulationEventStream(envelope.getPayloadList(), clientId);
                System.out.printf(">>[WS Gateway] Intercepted %d events from client %s. Forwarding down the pipeline...\n",
                        envelope.getChunkSize(), clientId);
            }
        } catch (Exception fault) {
            System.err.println("Critical exception unpacking raw live streaming buffer payload: " + fault.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String clientId = extractClientId(session);
        sessionsRegistry.remove(clientId);
        System.out.printf("[WS Gateway] Connection closed. Evicted Session -> ID: %s\n", clientId);
    }

    private String extractClientId(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri != null && uri.getQuery() != null) {
            String query = uri.getQuery();
            for (String param : query.split("&")) {
                String[] pair = param.split("=");
                if (pair.length > 1 && "clientId".equals(pair[0])) {
                    return pair[1];
                }
            }
        }
        return session.getId(); // Fallback identifier
    }
}
