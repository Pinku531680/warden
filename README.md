> [!IMPORTANT]
> **Project Status:** This project is currently a Work in Progress.

# Warden: Distributed Real-Time Fraud Detection System

#### Warden is a high-performance fraud detection ecosystem designed to identify anomalous transaction patterns through distributed orchestration and machine learning. It covers the full lifecycle from synthetic data generation to explainable ML-driven inference.

### **Architecture Overview**

The system is decoupled into three specialized services to ensure scalability and fault tolerance:

**Warden UI (React)**: Real-time monitoring dashboard featuring synthetic data generation pipelines, pre-simulation feature analytics, and live model insight logs.

**Warden Backend (Spring Boot)**: The central orchestration layer. Manages PostgreSQL/Redis state, executes complex feature engineering, ensures transaction idempotency, and maintains MQ reliability.

**Warden ML (FastAPI)**: A Python-based intelligence service utilizing Gradient Boosting models to provide probabilistic fraud scores and basic human-readable reasoning.
