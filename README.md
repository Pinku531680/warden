> [!IMPORTANT]
> **Readme Status:** Docs is currently in progress.

# Warden: High-Throughput Distributed Engine for Real-Time Transaction Fraud Inference

#### A high-throughput, microservices-driven event streaming pipeline engineered for real-time financial transaction fraud detection. Built with Spring Boot, FastAPI, and RabbitMQ, the system implements a closed-loop architecture featuring client-side reactive backpressure, low-latency micro-batched LightGBM inference, and server-side self-healing worker layers.

## **Live Demo & Observability Walkthrough**
https://github.com/user-attachments/assets/74a25cc8-4188-4cfa-94f5-fa6e25fd9138

## **System Architecture Blueprint**
Warden completely avoids traditional, open-loop synchronous HTTP request-response patterns. Instead, it relies on a decoupled, event-driven data plane that ensures strong data persistence, high throughput, and network resilience.
<p align="center">
  <img src="https://github.com/Pinku531680/my-images/blob/main/HIGH-RES-Warden-Architecture-DiagraM.png" alt="Warden System Architecture Diagram" width="100%">
</p>

## **Core Execution Planes**
Warden’s architecture is split into three decoupled services, each optimizing for a specific operational bottleneck — ingestion throughput, data simulation, or low-latency prediction.

### 1. High-Velocity Ingestion Gateway (`warden-backend`)

The backend serves as the durable system coordinator, handling high-frequency binary packet serialization and orchestration.
   - **Vectorized Data Handling**: **Consumes Protocol Buffer chunks** via stateful WebSockets, queries Redis in rapid batches to pull user          baselines, processes real-time feature engineering metrics, and executes **high-speed batch saves to PostgreSQL**.
   - **Two-Tier Idempotency Engine**: Intercepts network duplication twice. It uses an **initial fast Redis cache filter** to reject duplicate      transaction IDs at the gateway, and a **final database state validation in the response listener to prevent double processing**.
   - **Outbound Streaming**: Pushes parsed transaction vectors onto the RabbitMQ inference queue using pinned, single-channel scopes to             eliminate context-switching overhead.
   - **Server-Side Watchdog (Reliability Guarantee)**: A background sweeper task polls PostgreSQL every 15 seconds. If it captures any              transaction that has been trapped in a **PENDING state for more than 15 seconds due to broker or network dropouts**, it automatically re-      queues it to **guarantee reliable processing**.
   - **Immediate Results Settlement**: The **decoupled single-item response listener reads incoming model verdicts** from the results queue,        instantly commits the final status to PostgreSQL/Redis, and flushes the data down the client WebSocket channel in real time.
     
### 2. Synthetic Data & Observability Control Center (`warden-ui`)

Built from scratch without heavy third-party UI frameworks, the frontend operates as both an advanced behavioral data generator and an         engine monitor.
   - **Probabilistic Data Simulator**: Dynamically **generates realistic transaction streams** by mapping statistical distributions. It             injects complex fraud patterns on the fly, including **impossible travel anomalies**, **sudden velocity spikes**, **structural high-           spending deviations**, and **abnormal time profiles**. Utilizes many mathematical techniques, context, and conditions. All                     transaction data generation functions are in `/warden-ui/src/transactions/transactionsDataGeneration.js`.
   - **Reactive Backpressure Pacing**: Actively monitors downstream pipeline health. If **unacknowledged transactions in flight cross our safe        threshold**, the frontend automatically **pauses its data emission loops** to allow the backend pools to recover.
   - **Client-Side Retry Watchdog**: Tracks system delivery frames. Transactions are considered safely stored only when **the backend issues a       TXN_ACK post-PostgreSQL write**. If any transaction remains **unacknowledged for more than 10 seconds**, this client worker automatically re-transmits it.
   - **Real-Time System Observability**: Routes incoming WS event streams directly into a live console **tracking legit clearances**, **fraud       blocks**, **backend watchdog activity**, and **duplicate intercepts**. Renders real-time metric counters for each event type, tracks the       live average processing time for transactions, and dynamically **displays the current status of the Emission Pipeline** (`Active, Throttled, Idle`).

### 3. Decoupled Inference Worker (`warden-ml`)

The machine learning pipeline is intentionally separated from the core data paths to ensure that training and evaluation never block live system ingestion.
   - **Isolated Architecture**: Operates independently of the database and web servers, interacting solely with the message broker to ensure        absolute resource isolation.
   - **High-Performance LightGBM Core**: Consumes transaction bytes directly from RabbitMQ and runs high-speed micro-batched evaluations using      a trained LightGBM classifier, combining the high accuracy of gradient boosting with sub-millisecond execution times.
   - **Verdict Relinquishment**: Pushes completed fraud prediction records onto the dedicated RabbitMQ results queue, handing execution             control cleanly back to the Spring Boot response infrastructure.
    


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

