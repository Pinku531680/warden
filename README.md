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
   - **Server-Side Watchdog (Reliability Guarantee)**: A background sweeper task polls PostgreSQL every 15 seconds. If it captures any              transaction that has been trapped in a **PENDING state for more than 15 seconds due to broker or network dropouts**, it automatically re-      queues it, enforcing a strict **At-Least-Once Processing** guarantee.
   - **Immediate Results Settlement**: The **decoupled single-item response listener reads incoming model verdicts** from the results queue,        instantly commits the final status to PostgreSQL/Redis, and flushes the data down the client WebSocket channel in real time.
     
### 2. Synthetic Data & Observability Control Center (`warden-ui`)

Built from scratch without heavy third-party UI frameworks, the frontend operates as both an advanced behavioral data generator and an         engine monitor.
   - **Probabilistic Data Simulator**: Dynamically **generates realistic transaction streams** by mapping statistical distributions. It             injects complex fraud patterns on the fly, including **impossible travel anomalies**, **sudden velocity spikes**, **structural high-           spending deviations**, and **abnormal time profiles**. Utilizes many mathematical techniques, context, and conditions. All                     transaction data generation functions are in `/warden-ui/src/transactions/transactionsDataGeneration.js`.
   - **Reactive Backpressure Throttling**: Actively monitors downstream pipeline health. If **unacknowledged transactions in flight cross our safe threshold**, the frontend automatically **pauses its data emission loops** to allow the backend pools to recover.
   - **Client-Side Retry Watchdog**: Tracks system delivery frames. Transactions are considered safely stored only when **the backend issues a** `TXN_ACK` **post-PostgreSQL write**. If any transaction remains **unacknowledged for more than 10 seconds**, this client worker automatically re-transmits it.
   - **Real-Time System Observability**: Routes incoming WS event streams directly into a live console **tracking legit clearances**, **fraud       blocks**, **backend watchdog activity**, and **duplicate intercepts**. Renders real-time metric counters for each event type, tracks the       live average processing time for transactions, and dynamically **displays the current status of the Emission Pipeline** (`Active, Throttled, Idle`).

### 3. Decoupled Inference Worker (`warden-ml`)

The machine learning pipeline is intentionally separated from the core data paths to ensure that training and evaluation never block live system ingestion.
   - **Isolated Architecture**: Operates **independently of the database and web servers**, interacting solely with the message broker to           ensure absolute resource isolation.
   - **Latency-Bound Micro-Batching Core**: Consumes transaction bytes directly from RabbitMQ and **runs high-speed micro-batched evaluations         using a trained LightGBM classifier**. A background timer daemon forces immediate evaluations if data dries up, combining the high             accuracy of gradient boosting with sub-millisecond execution times.
   - **Verdict Relinquishment**: Pushes completed fraud prediction records onto the dedicated RabbitMQ results queue, handing execution             control cleanly back to the Spring Boot response infrastructure.
    
## **System Optimizations & Impact**
This section details the underlying infrastructure mechanics engineered to maximize processing throughput while enforcing strict message delivery and data-plane reliability.

### 1. Protobuf Binary Packing vs. JSON
   - **The Optimization**: Replaced standard textual JSON with compiled Protocol Buffers over WebSockets. This **compresses the inbound               transaction payload size by ~60-75% for our schemas** `LiveInferenceEventProto` and `LiveTransactionEventProto`.
   - **The Impact**: By utilizing variable-length varints and fixed 4-byte layouts for numerical parameters instead of plain text strings,          data density is maximized. This **allows RabbitMQ to buffer 2-3x** as many records directly in RAM, eliminating premature paging disk lookups while enabling Python to deserialize streams at significant speeds.
     
### 2. Dual-Watchdog Fault Isolation (At-Least-Once Delivery)
   - **The Optimization**: Implemented a **two-tier recovery architecture** split between the browser and the database layer to **ensure zero data frame loss**.
   - **The Mechanics**: The client-side watchdog catches transport dropouts by auto-retrying transactions that fail to secure a database            `TXN_ACK` within 10 seconds. Simultaneously, **a backend background sweeper checks PostgreSQL every 15 seconds** to automatically re-queue transactions stuck in a `PENDING` state. This guarantees At-Least-Once Delivery across the wire, which **achieves Effectively Exactly-Once Semantics (EOS)** when combined with our ingestion de-duplication layer.
     
### 3. Stateless Inference Workers (Compute vs. Network I/O)
   - **The Optimization**: The Python ML consumer acts as a **purely stateless compute node**. It performs **zero database calls**, user checks, or idempotency validations.
   - **The Impact**: If the worker had to **execute a remote network round-trip** to Redis or PostgreSQL to verify state integrity for every item inside a high-speed micro-batch array, the entire machine learning container would immediately shift from a **fast CPU/cache-bound system** into a **slow, network I/O-bound bottleneck**. State verification and idempotency guards are **intentionally localized at the ingestion gates** to protect LightGBM evaluation throughput.

### 4. Transient Message Queues for Zero-Disk Streaming Egress
   - **The Optimization:** Configured all RabbitMQ queues and routing keys as non-durable and transient, forcing messages to reside entirely   within RAM allocators.
   - **The Impact:** Standard message streaming architectures write payloads to disk to survive unexpected broker crashes, but this forces the operating system to perform **expensive disk-flush** (`fsync`) operations that severely **limit message throughput**. Because the Spring Boot ingestion layer writes every inbound transaction to **PostgreSQL immediately upon arrival**, the database already serves as our **durable, persistent log**. Making RabbitMQ write to disk as well would create a **redundant, double-logging penalty across the system**. If the broker crashes and loses its memory frames, **the server-side watchdog service seamlessly recovers** the lost state by scanning the database log and re-injecting any uncompleted rows.

## **Data Plane & Tech Stack**

### Data & State Infrastructure
* **PostgreSQL:** Serves as the persistent operational audit log and master ledger for all inbound transactions.
* **Redis Cloud:** Utilized as an ultra-low-latency distributed cache layer to handle initial idempotency checks and store real-time user state baselines.
* **RabbitMQ:** Implements asynchronous, decoupled message lines using transient AMQP channels to isolate ingestion from heavy inference compute loops.

### Core Compute & Inference Core
* **Spring Boot:** Handles the high-frequency WebSocket connection lifecycle, Protobuf parsing, and fast transactional database operations.
* **Python Service (FastAPI):** Hosts the stateless ML worker endpoints, consuming binary vectors directly from the broker lines.
* **LightGBM:** Serves as the core binary classification engine, chosen to leverage gradient boosting parallelism at sub-millisecond execution speeds.

### Telemetry & Visualization
* **React.js:** Operates as the lightweight client dashboard core, written without third-party design frameworks to keep strict control over DOM rendering loops.
* **Recharts & Nivo:** Used to render highly optimized, hardware-accelerated SVG/Canvas visualizations for live feature distributions and statistical anomalies.
* **Google Protocol Buffers (Proto3):** Enforces a strict, cross-language binary serialization schema across the frontend, backend, and machine learning runtimes.

