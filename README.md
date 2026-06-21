> [!IMPORTANT]
> **Readme Status:** Docs is currently in progress.

# Warden: High-Throughput Distributed Engine for Real-Time Transaction Fraud Inference

#### A high-throughput, microservices-driven event streaming pipeline engineered for real-time financial transaction fraud detection. Built with Spring Boot, FastAPI, and RabbitMQ, the system implements a closed-loop architecture featuring client-side reactive backpressure, low-latency micro-batched LightGBM inference, and server-side self-healing worker layers.

## **Live Demo & Observability Walkthrough**
https://github.com/user-attachments/assets/74a25cc8-4188-4cfa-94f5-fa6e25fd9138

## **Architecture Overview**

The system is decoupled into three specialized services to ensure scalability and fault tolerance:

**Warden UI (React)**: Real-time monitoring dashboard featuring synthetic data generation pipelines, pre-simulation feature analytics, and live model insight logs (with post-simulation analytics).

**Warden Backend (Spring Boot)**: The central orchestration layer. Manages PostgreSQL/Redis state, executes complex feature engineering, ensures transaction idempotency, and maintains MQ reliability.

**Warden ML (FastAPI)**: A Python-based intelligence service utilizing Gradient Boosting models to provide probabilistic fraud scores and basic human-readable reasoning.


## **Key Features**

**1. Data Generation & Pipelines**
   
**Adversarial Simulation**: Custom pipelines to generate realistic "Attack" scenarios, including ***Impossible Travel (high-speed GPS shifts)***, ***Behavioral Anomalies***, ***Temporal Deviations (odd-hour transactions mapped to local timezones)***, and ***Statistical Surges***.

**Feature Analytics**: Integrated pre-simulation tools to analyze feature distributions before they hit the inference engine.

**2. High-Performance Orchestration**
   
**Feature Engineering**: Real-time calculation of ATV Delta, Geodesic Distance, and Temporal Velocity using Redis for low-latency state lookups.

**Reliability & Idempotency**: Custom logic to prevent duplicate processing and a 15-second watchdog timer that re-queues lost transactions to ensure guaranteed processing.

**3. Explainable ML Inference**
   
**Probabilistic Scoring**: Moves beyond binary classification to provide a raw fraud probability (0.0 to 1.0).

**Model Explainability**: Generates basic natural language reasons for every decision.

**Real-time Loop**: Inferences are pushed back to the UI via the backend for logging and post-simulation analytics.


## **Tech Stack**

**Backend**: Spring Boot, Java, PostgreSQL, Redis

**Machine Learning**: Python (FastAPI), Scikit-Learn, LightGBM

**Message Broker**: RabbitMQ

**Frontend**: React.js, Recharts, and Nivo (for visualization of feature analytics)

