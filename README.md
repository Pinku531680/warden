
# Warden: High-Throughput Distributed Engine for Real-Time Transaction Fraud Inference

A high-throughput distributed system engineered for real-time transaction fraud detection, powered by a **custom data generator instead of standard static datasets**. The architecture enforces strict **upstream flow control** using client-side backpressure tracking, feeding a stateless, micro-batched ML inference core. Protected by a **two-tier idempotency filter** and dual **client/server watchdog safety nets**, the entire execution plane delivers effectively **exactly-once processing** guarantees alongside full, real-time **system observability**.

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
   - **The Optimization:** Configured all RabbitMQ queues and routing keys as `non-durable` and transient, forcing messages to reside entirely   within RAM allocators.
   - **The Impact:** Standard message streaming architectures write payloads to disk to survive unexpected broker crashes, but this forces the operating system to perform **expensive disk-flush** (`fsync`) operations that severely **limit message throughput**. Because the Spring Boot ingestion layer writes every inbound transaction to **PostgreSQL immediately upon arrival**, the database already serves as our **durable, persistent log**. Making RabbitMQ write to disk as well would create a **redundant, double-logging penalty across the system**. If the broker crashes and loses its memory frames, **the server-side watchdog service seamlessly recovers** the lost state by scanning the database log and re-injecting any uncompleted rows.

## **Data Plane & Tech Stack**

### 1. Data & State Infrastructure
* **PostgreSQL:** Serves as the persistent operational audit log and master ledger for all inbound transactions.
* **Redis:** Utilized as an ultra-low-latency distributed cache layer to handle initial idempotency checks and store real-time user state baselines.
* **RabbitMQ:** Implements asynchronous, decoupled message lines using transient AMQP channels to isolate ingestion from heavy inference compute loops.

### 2. Core Compute & Inference Core
* **Spring Boot:** Handles the high-frequency WebSocket connection lifecycle, Protobuf parsing, and fast transactional database operations.
* **Python Service (FastAPI):** Hosts the stateless ML worker endpoints, consuming binary vectors directly from the broker lines.
* **LightGBM:** Serves as the core classification engine, chosen to leverage gradient boosting parallelism at sub-millisecond execution speeds.

### 3. Telemetry & Visualization
* **React.js:** Operates as the lightweight client dashboard and simulation core, written without third-party design frameworks to keep strict control over DOM rendering loops while actively managing the in-memory flight registry for reactive backpressure tracking.
* **Protocol Buffers:** Enforces a strict, cross-language binary serialization schema across the system, enabling low-overhead, chunked data emission from the client to the gateway.
* **Recharts & Nivo:** Used to render highly optimized, hardware-accelerated visualizations for live feature distributions and statistical anomalies.

## **Architectural Takeaways & Learnings**
Building Warden required moving past basic framework abstractions to confront the core realities of distributed infrastructure design. Below are the foundational paradigms and engineering truths established through this project:

### 1. The Reality of Message Queues
* **The Insight:** Message queues are not magical, indestructible black boxes—they are finite, memory-allocated network buffers. If downstream consumers fall behind during a massive stream ingestion, an unprotected queue will either run out of RAM or choke by dumping data onto the disk. 
* **The Solution:** Systems must be designed assuming the broker *will* fail or lose data at scale. This reality drove the implementation of the backend watchdog layer to guarantee state reconstruction if the message queue's RAM gets wiped.

### 2. Deconstructing Exactly-Once Semantics (EOS)
* **The Insight:** In distributed networks, true network-level "exactly-once delivery" is mathematically impossible due to the Two Generals' Problem. 
* **The Solution:** Warden achieves **Effectively Exactly-Once Semantics** by breaking the problem down into an infrastructure equation:
   
  `Exactly-Once Semantics = At-Least-Once Delivery (Client/Server Watchdogs) + Idempotent Processing`
  
  Forcing the system to cleanly capture and discard unavoidable duplicates at the boundaries is the only way to safeguard state integrity.

### 3. Streaming Demands Reactive Flow Control
* **The Insight:** Data streaming cannot operate reliably as a simple one-way "push" model. Without feedback, a fast client will trivially overwhelm downstream network buffers, database connection pools, and machine learning memory arrays.
* **The Solution:** Implementing tracking mechanisms like a client-side flight registry for **Reactive Backpressure Handling** is a mandatory prerequisite for stream stability. By tracking unacknowledged frames, the producer can dynamically throttle its own emission pace to perfectly match the real-time processing capacity of the backend.

### 4. Rethinking Queue Durability and I/O Penalties
* **The Insight:** Defaulting to "durable" queue settings blindly in a message broker creates a hidden performance bottleneck. Forcing a broker to save every single message to disk degrades streaming throughput significantly due to heavy disk I/O overhead.
* **The Solution:** Since the ingestion gateway already records every transaction directly into **PostgreSQL** the moment it arrives, the database serves as our permanent, secure system record. This allows the broker queues to remain entirely transient (in-memory) for maximum speed. If the broker crashes and loses its memory frames, the recovery responsibility is simply shifted to the database ledger: the background watchdog scans the table and re-injects any uncompleted records, maximizing performance without losing any data.

### 5. Serialization Efficiency: JSON vs ProtoBuf
* **The Insight:** Sending streaming data as standard JSON text strings creates unnecessary overhead. Carrying full-text field keys (like `"merchantType"` or `"transactionAmount"`) over the network inflates network packet sizes, and converting raw text back into code objects forces the system to waste valuable CPU cycles.
* **The Solution:** Switching to a binary format like **Protocol Buffers** shrinks our network footprint by ~40–75%. Protobuf achieves this by stripping out all text keys entirely, replacing them with tiny integer tags mapped to a compiled blueprint. Additionally, it packs numerical data directly into dense binary bytes rather than writing out every digit as a text character, allowing our services to unpack incoming streams significantly faster.

### 6. Mathematical Simulation vs. ML-Generated Data
* **The Insight:** Using a machine learning model (like a GAN or an LLM) to generate synthetic data to train another machine learning model creates a dangerous feedback loop. Generative models struggle to accurately map absolute physical laws or strict logical boundaries; instead, they risk introducing hallucinations, smoothing over critical anomalies, and reinforcing hidden assumptions or training biases.

  Because these models can only replicate what they have already seen, they are fundamentally incapable of creating completely new variations or true black-swan edge cases. Training a classifier on this data means we are simply teaching it to copy another model's statistical guesswork.
* **The Systems Payoff:** Building a custom data generation engine natively (`warden-ui/src/transactions/transactionsDataGeneration.js`) using explicit mathematical functions and statistical distributions is incredibly painful. It requires endless cycles of trial, error, and meticulous parameter tuning to make the simulated behaviors look real. However, the payoff is absolute environmental control: we can manually inject deterministic edge cases, coordinate traps, and rare behavioral velocity spikes.

  This lets us stress-test the data pipelines under harsh, pristine conditions that standard black-box machine learning generators completely fail to capture.

## **Technical References**
Understanding Warden's architecture required diving into individual engineering articles and video breakdowns of Kafka, RabbitMQ, Flink, Idempotency, Backpressure, etc., and grasping the realities of distributed systems at scale.

* **Idempotency by Arpit Bhayani:** [Idempotency](https://www.youtube.com/watch?v=m6DtqSb1BDM)
* **Backpressure Mechanics:** [Conduktor: Deep-Dive into Backpressure Handling in Streaming Systems](https://www.conduktor.io/glossary/backpressure-handling-in-streaming-systems)
* **Streaming Essentials:** [*Streaming Essentials*](https://medium.com/@yaroslavzhbankov/streaming-essentials-types-architectures-and-best-practices-47137df8b9e3)
* **Redis Internals by Shubham Agrawal:** [Redis Internals](https://medium.com/better-programming/internals-workings-of-redis-718f5871be84)
* **Message Broker Architecture:** [Message Brokers System Design](https://www.youtube.com/watch?v=1ISRd0bS714)
* **Protocol Buffers:** [Protocol Buffers Benchmarks](https://entzik.medium.com/json-vs-protocol-buffers-4771762663ea)
* **Apache Flink by Jordan Epstein:** [Apache Flink Deep Dive](https://www.youtube.com/watch?v=DZwnP_qwAlA)

## **A Note on the Pioneers of Distributed Systems**

Building even a small-scale distributed data system from scratch is a humbling reality check: **distributed infrastructure is a brutal discipline**. It is incredibly easy to import a high-level library or spin up a managed cloud instance with a single click. But stripping away those abstractions forces you to wrestle directly with raw system constraints, revealing the sheer genius of the early engineers who built the foundations of computing from the ground up, even before most modern problems existed.

It is mind-blowing that the core design patterns we rely on today were charted out by brilliant minds long before modern high-performance hardware even existed. This project was a direct exercise in respecting and learning those timeless mechanics first. We stand on the shoulders of giants, looking out at a horizon that has no end. They showed us how to tame the early chaos, but the road ahead remains open. In the physics of data and scale, solving one problem just opens the door to a massive world of new questions.
