package org.example.springbootbackend.config;

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

    public WebSocketConfig(TransactionWebSocketHandler transactionWebSocketHandler) {
        this.transactionWebSocketHandler = transactionWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Exposes the binary-compliant Protocol Buffer pipeline endpoint to your UI dashboard
        registry.addHandler(transactionWebSocketHandler, "/ws/transactions-binary-ingest")
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
