from pydantic import BaseModel
from schemas import Transaction
from typing import Optional, Dict, Any
import json
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

from workers.inference_consumer import start_inference_worker, stop_inference_worker
from workers.training_worker import start_training_worker, stop_training_worker
from pipeline.training import execute_model_training_lifecycle

@asynccontextmanager
async def app_lifespan(app: FastAPI):
    # APPLICATIONS LIFECYCLE: APP STARTUP ENGINE
    # Safe environment extraction bindings before the web thread exposes ports
    os.environ["RABBITMQ_URL"] = "amqps://ovksenqm:V-nNSY3rs-0gH8XGtSD23uilwUxNyQZE@dingo.rmq.cloudamqp.com/ovksenqm"
    os.environ["DB_HOST"] = "localhost"
    os.environ["DB_NAME"] = "warden"
    os.environ["DB_USER"] = "postgres"
    os.environ["DB_PASSWORD"] = "root"

    # Fire the background consumer thread without blocking the FastAPI event loop
    start_training_worker()
    start_inference_worker()  # Launches Micro-Batch Inference Listener Thread

    yield  # Application serves traffic here...

    print("\n[Warden ML Core] Commencing administrative socket teardown...")

    stop_training_worker()
    stop_inference_worker()
    print("[Warden ML Core] Microservice shutdown procedures completed.")


# Initialize the application instance bound to the lifespan state machine
app = FastAPI(
    title="Warden ML Analytics Service",
    version="1.0.0",
    lifespan=app_lifespan
)

# Standard Cross-Origin Resource Sharing settings for your UI dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FASTAPI OPERATIONAL HTTP PATH ROUTERS

@app.get("/")
async def root():
    return {"message": "Python service working."};


@app.post("/model/train")
def train_model_manually():
    """
    MANUAL TRAINING GATEWAY:
    Loads the total compiled dataset accumulated from disk and executes training.
    """
    parquet_path = "./data/transactions_training.parquet"

    # Guard: Ensure the user has actually generated data before trying to train
    if not os.path.exists(parquet_path):
        raise HTTPException(
            status_code=400,
            detail="Training dataset not found on disk. Please generate data blocks via the UI dashboard first."
        )

    try:
        print(f"[API] Loading accumulated dataset directly from disk: {parquet_path}")
        # High-performance zero-copy binary read straight into memory dataframe
        df = pd.read_parquet(parquet_path)

        # Fire the LightGBM training, evaluation, and serialization lifecycle
        metrics = execute_model_training_lifecycle(df)

        return {
            "metrics": metrics,
            "status": "SUCCESS",
            "message": f"LightGBM classifier trained successfully on accumulated corpus.",
            "total_samples_trained": len(df),
            "artifact_saved_path": "./models/warden_lightgbm_model.pkl"
        }

    except Exception as fault:
        print(f"[API] Manual model training execution pass crashed: {fault}")
        raise HTTPException(status_code=500, detail=f"Internal pipeline training failure: {str(fault)}")



@app.get("/model/metrics")
def get_latest_model_metrics():
    """
    METRICS RETRIEVAL ROUTE:
    Reads and outputs the saved performance snapshot file from the last training pass.
    """
    metrics_path = "./models/evaluation_metrics.json"

    # Guard: Return error notice if the user calls the route before running a training loop
    if not os.path.exists(metrics_path):
        raise HTTPException(
            status_code=404,
            detail="No saved metrics found. Please train the model manually via POST /model/train first."
        )

    try:
        # Read the file and parse it back to a clean JSON object API response
        with open(metrics_path, "r", encoding="utf-8") as json_file:
            saved_metrics = json.load(json_file)

        return {
            "status": "SUCCESS",
            "compiled_metrics": saved_metrics
        }

    except Exception as fault:
        print(f"[API] Failed to parse metrics snapshot: {fault}")
        raise HTTPException(status_code=500, detail="Internal error reading stored metric states.")

@app.get("/model/status")
def get_model_status():
    has_model = os.path.exists("./models/warden_lightgbm_model.pkl")
    dataset_exists = os.path.exists("./data/transactions_training.parquet")

    total_rows = 0
    if dataset_exists:
        try:
            df = pd.read_parquet("./data/transactions_training.parquet")
            total_rows = len(df)
        except Exception:
            pass

    return {
        "phase": "OPERATIONAL",
        "model_compiled": has_model,
        "dataset_accumulated_rows": total_rows,
        "active_worker": True
    }

@app.get("/data/status")
def get_model_status():
    # Placeholder for live model serving metrics during inference simulations later

    dataset_exists = os.path.exists("./data/transactions_training.parquet")

    total_rows = 0
    if dataset_exists:
        try:
            df = pd.read_parquet("./data/transactions_training.parquet")
            total_rows = len(df)
        except Exception:
            pass

    return {
        "phase": "TRAINING",
        "has_dataset": os.path.exists("./data/transactions_training.parquet"),
        "active_worker": True,
        "dataset_row_count": total_rows
    }

@app.post("/predict")
async def predict(obj: Transaction):

    print(obj);

    return {
        "status": "Received",
        "data_echo": obj
    };


