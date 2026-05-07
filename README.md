> [!IMPORTANT]
> **Project Status:** This project is currently a Work in Progress.

# Warden: Distributed Real-Time Fraud Detection System

#### Warden is a high-performance fraud detection ecosystem designed to identify anomalous transaction patterns through distributed orchestration and machine learning. It covers the full lifecycle from synthetic data generation to explainable ML-driven inference.


## **Architecture Overview**

The system is decoupled into three specialized services to ensure scalability and fault tolerance:

**Warden UI (React)**: Real-time monitoring dashboard featuring synthetic data generation pipelines, pre-simulation feature analytics, and live model insight logs.

**Warden Backend (Spring Boot)**: The central orchestration layer. Manages PostgreSQL/Redis state, executes complex feature engineering, ensures transaction idempotency, and maintains MQ reliability.

**Warden ML (FastAPI)**: A Python-based intelligence service utilizing Gradient Boosting models to provide probabilistic fraud scores and basic human-readable reasoning.


## **Key Features**

**1. Data Generation & Pipelines**
   
**Adversarial Simulation**: Custom pipelines to generate realistic "Attack" scenarios, including **Impossible Travel (high-speed GPS shifts)**, **Behavioral Anomalies**, **Temporal Deviations (odd-hour transactions mapped to local timezones)**, and **Statistical Surges (ATV Delta spikes)**.

**Feature Analytics**: Integrated pre-simulation tools to analyze feature distributions before they hit the inference engine.

**2. High-Performance Orchestration**
   
**Feature Engineering**: Real-time calculation of ATV Delta, Geodesic Distance, and Temporal Velocity using Redis for low-latency state lookups.

**Reliability & Idempotency**: Custom logic to prevent duplicate processing and a 30-second watchdog timer that re-queues lost transactions to ensure 100% processing uptime.

**3. Explainable ML Inference**
   
**Probabilistic Scoring**: Moves beyond binary classification to provide a raw fraud probability (0.0 to 1.0).

**Model Explainability**: Generates basic natural language reasons for every decision.

**Real-time Loop**: Inferences are pushed back to the UI via the backend for immediate visualization, logging, and post-simulation analytics.

