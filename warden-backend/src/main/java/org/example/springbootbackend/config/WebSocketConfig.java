package org.example.springbootbackend.config;

import org.example.springbootbackend.controller.LiveSimulationWebSocketHandler;
import org.example.springbootbackend.controller.TransactionWebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final TransactionWebSocketHandler transactionWebSocketHandler;
    private final LiveSimulationWebSocketHandler liveSimulationWebSocketHandler;

    public WebSocketConfig(TransactionWebSocketHandler transactionWebSocketHandler, LiveSimulationWebSocketHandler liveSimulationWebSocketHandler) {
        this.transactionWebSocketHandler = transactionWebSocketHandler;
        this.liveSimulationWebSocketHandler = liveSimulationWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Training Pipeline
        registry.addHandler(transactionWebSocketHandler, "/ws/transactions-binary-ingest")
                .setAllowedOrigins("*");

        // Live Simulation Engine Pipeline
        registry.addHandler(liveSimulationWebSocketHandler, "/ws/live-simulation-ingest")
                .setAllowedOrigins("*");
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(4096 * 1024); // Expand buffer allocations to 4MB
        container.setMaxBinaryMessageBufferSize(4096 * 1024); // Prevents frame fragmentation on heavy transaction blocks
        return container;
    }
}
