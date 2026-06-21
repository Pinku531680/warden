package org.example.springbootbackend.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String TRAINING_EXCHANGE = "warden.training.exchange";
    public static final String TRAINING_QUEUE = "warden.training.trigger.queue";
    public static final String TRAINING_ROUTING_KEY = "warden.training.completed";

    // LIVE INTERACTIVE INFERENCE CHANNEL CONSTANTS
    public static final String SIMULATION_INFERENCE_QUEUE = "simulation-inference-queue";
    public static final String SIMULATION_RESULTS_QUEUE = "simulation-results-queue";

    @Bean
    public TopicExchange trainingExchange() {
        return new TopicExchange(TRAINING_EXCHANGE, true, false);
    }

    @Bean
    public Queue trainingQueue() {
        return new Queue(TRAINING_QUEUE, true, false, false);
    }

    @Bean
    public Binding binding(Queue trainingQueue, TopicExchange trainingExchange) {
        return BindingBuilder.bind(trainingQueue).to(trainingExchange).with(TRAINING_ROUTING_KEY);
    }

    // Live Real-Time Data Plane Simulation Queues
    @Bean
    public Queue simulationInferenceQueue() {
        return new Queue(SIMULATION_INFERENCE_QUEUE, false, false, false);
    }

    @Bean
    public Queue simulationResultsQueue() {
        return new Queue(SIMULATION_RESULTS_QUEUE, false, false, false);
    }
}
