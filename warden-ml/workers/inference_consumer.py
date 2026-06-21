# workers/inference_consumer.py
import os
import pandas as pd
import numpy as np
import joblib
import pika
import time
import threading
from proto.live_simulation_pb2 import LiveInferenceEventProto

# Configuration boundaries for connection channels
RABBITMQ_URL = "amqps://ovksenqm:V-nNSY3rs-0gH8XGtSD23uilwUxNyQZE@dingo.rmq.cloudamqp.com/ovksenqm"
INFERENCE_QUEUE = "simulation-inference-queue"
RESULTS_QUEUE = "simulation-results-queue"

BATCH_MIN_SIZE = 10
BATCH_MAX_SIZE = 30
MAX_HOLD_TIME_SEC = 0.05  # 50 Millisecond latency window

# FIXED ARCHITECTURAL CATEGORICAL CONTRACT
ACC_TYPE_MAP = {
    "STUDENT": 0,
    "STANDARD": 1,
    "PREMIUM": 2,
    "BUSINESS": 3
}

MERCHANT_TYPE_MAP = {
    "GROCERY": 0,
    "DIGITAL": 1,
    "TRAVEL": 2,
    "LUXURY": 3,
    "CRYPTO": 4
}

# Global lifecycle tracking pointers for background threads
_inference_thread = None
_channel = None
_engine_instance = None


class MicroBatchInferenceEngine:
    def __init__(self):
        self.buffer = []
        self.lock = threading.Lock()
        self.last_flush_time = time.time()

        # Connection references to safely handle thread orchestration
        self.connection = None
        self.channel = None

        # Connect to your LightGBM model pipeline components
        self.model = self.load_production_lightgbm_model()

    def load_production_lightgbm_model(self):
        """
        Loads the actual trained LightGBM binary classifier from disk.
        """
        model_path = os.path.join("models", "warden_lightgbm_model.pkl")

        if os.path.exists(model_path):
            print(f"[ML Core] Loading trained LightGBM model from cache: {model_path}")
            return joblib.load(model_path)
        else:
            print(f"[ML Core] Trained model not found at '{model_path}'. Falling back to default baseline rules.")
            # Simple heuristic rule engine fallback if pkl hasn't been compiled yet
            return lambda features: [0.85 if f[6] > 1000 or f[9] == 1 else 0.05 for f in features]

    def start_consuming(self, connection, channel):
        global _channel
        self.connection = connection
        self.channel = channel
        _channel = channel

        _channel.queue_declare(queue=INFERENCE_QUEUE, durable=False)
        _channel.queue_declare(queue=RESULTS_QUEUE, durable=False)

        # FIXED: Pass self down to background loop without injecting raw socket params
        threading.Thread(target=self.enforce_latency_timeout_loop, daemon=True).start()

        print(f"[ML Core] Micro-batch inference consumer attached to queue [{INFERENCE_QUEUE}]. Listening...")


        # INACTIVITY TIMEOUT INGESTION ALIGNMENT Passing inactivity_timeout prevents the generator from locking the thread.
        # It yields None if the queue is empty, letting thread - safe callbacks execute.
        for method_frame, properties, body in _channel.consume(INFERENCE_QUEUE, auto_ack=False, inactivity_timeout=0.1):
            if method_frame is None:
                continue
            with self.lock:
                self.buffer.append((method_frame, body))
                buffer_len = len(self.buffer)

            # If the main thread fills the buffer to maximum, execute a flush directly
            if buffer_len >= BATCH_MAX_SIZE:
                print("[ML Core] Maximum batch capacity reached on main thread. Flushing...")
                self.flush_batch_inference_pool()

    def enforce_latency_timeout_loop(self):

        while True:
            time.sleep(0.5)  # High-frequency poll rate every 500ms
            with self.lock:
                time_since_flush = time.time() - self.last_flush_time
                buffer_len = len(self.buffer)
                has_items = buffer_len > 0

            # Threadsafe scheduling logic
            if has_items and (time_since_flush >= MAX_HOLD_TIME_SEC or buffer_len >= BATCH_MIN_SIZE):
                print(f"[ML Timer] Latency timeout or min batch size reached ({buffer_len} items). Scheduling flush on main thread...")

                # Request the main thread loop to safely execute the flush operation
                self.connection.add_callback_threadsafe(self.trigger_flush_from_main_thread)
            # else:
            #     print(f"[High Frey Poll] No items, or not MIN items, or time_since_flush <= MAX_HOLD_TIME");

    def trigger_flush_from_main_thread(self):
        """
        Target execution point invoked strictly inside the Main Connection Thread.
        """
        self.flush_batch_inference_pool()

    def flush_batch_inference_pool(self):
        """
        Executes ML inference over gathered vectors and flushes data downstream.
        Guaranteed to be execution-safe because it runs on the main connection thread.
        """
        with self.lock:
            if not self.buffer:
                return
            current_batch = self.buffer
            self.buffer = []
            self.last_flush_time = time.time()

        print(f"[ML Batcher] Processing micro-batch allocation bundle of {len(current_batch)} transactions...")

        deserialized_protos = []
        features_matrix = []

        # Deserialize binary payloads
        for method_frame, body in current_batch:
            proto = LiveInferenceEventProto()
            proto.ParseFromString(body)
            deserialized_protos.append((method_frame, proto))

            encoded_acc_type = ACC_TYPE_MAP.get(proto.accType.upper(), 1)  # Default fallback to STANDARD (1)
            encoded_merchant_type = MERCHANT_TYPE_MAP.get(proto.merchantType.upper(), 0)  # Default fallback to GROCERY (0)

            # Extract engineered features exactly how the LightGBM model was trained
            feature_vector = [
                int(encoded_acc_type),  # 1. acc_type
                int(proto.accAge),  # 2. acc_age
                int(proto.flaggedTxns),  # 3. flagged_txns
                int(proto.txnAmt),  # 4. txn_amt
                int(encoded_merchant_type),  # 5. merchant_type
                1 if proto.geoCountryMismatch else 0,  # 6. geo_country_mismatch
                int(proto.geoDistanceKm),  # 7. geo_distance_km
                int(proto.speedKmh),  # 8. speed_kmh
                int(proto.timeGapLastTxn),  # 9. time_gap_last_txn
                1 if proto.highTxnVelocity else 0,  # 10. high_txn_velocity
                float(proto.userAtvDelta),  # 11. user_atv_delta
                1 if proto.isNewDevice else 0,  # 12. is_new_device
                1 if proto.isAbnormalTime else 0  # 13. is_abnormal_time
            ]
            features_matrix.append(feature_vector)

        # Execute High-Performance Batch Inference
        if hasattr(self.model, "predict_proba"):
            # Provide an explicit column schema matching your training features list exactly
            features_df = pd.DataFrame(features_matrix, columns=[
                "acc_type", "acc_age", "flagged_txns", "txn_amt", "merchant_type",
                "geo_country_mismatch", "geo_distance_km", "speed_kmh", "time_gap_last_txn",
                "high_txn_velocity", "user_atv_delta", "is_new_device", "is_abnormal_time"
            ])

            # Explicitly cast categorical columns to 'category' dtype to match training schema
            features_df["acc_type"] = features_df["acc_type"].astype("category")
            features_df["merchant_type"] = features_df["merchant_type"].astype("category")

            # Execute High-Performance Batch Inference
            scores = self.model.predict_proba(features_df)[:, 1]

            # FIXED: Vectorized rounding tool to trim scores down to 2 decimal places efficiently
            scores = np.round(scores, 2)
        else:
            print("[Fallback] Cannot predict using predict_proba() method")
            # Fallback handling mechanics for basic validation lambda functions
            scores = self.model(features_matrix)
            scores = [round(s, 2) for s in scores]

        # 3. Serialize results and push back to RabbitMQ results queue
        for i, (method_frame, proto) in enumerate(deserialized_protos):
            proto.fraudScore = float(scores[i])
            proto.status = "REJECTED" if scores[i] >= 0.8 else "APPROVED"

            # Serialize the updated message payload
            serialized_data = proto.SerializeToString()

            # FIXED: Runs on main thread safely using object instance channel references
            self.channel.basic_publish(
                exchange='',
                routing_key=RESULTS_QUEUE,
                body=serialized_data
            )

            # Acknowledge the message on the matching delivery thread context
            self.channel.basic_ack(delivery_tag=method_frame.delivery_tag)

        print(f"Batch inference finalized. Flushed verdicts back down '{RESULTS_QUEUE}'.")


def _run_inference_loop(amqp_url: str):
    """
    The internal blocking network loop running inside the background thread context.
    """
    global _channel, _engine_instance
    try:
        print("[Inference Worker] Initializing background AMQP listener connection...")
        params = pika.URLParameters(amqp_url)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        _engine_instance = MicroBatchInferenceEngine()
        # Pass the connection handle along to manage safe scheduling loops
        _engine_instance.start_consuming(connection, channel)

    except pika.exceptions.AMQPConnectionError:
        print("[Inference Worker] CloudAMQP connection broken or closed safely.")
    except Exception as err:
        print(f"[Inference Worker] Unexpected loop termination exception: {err}")
    finally:
        print("[Inference Worker] Background consumer channel closed.")


def start_inference_worker():
    """
    Spins up the micro-batch inference consumer loop inside a safe background daemon thread.
    """
    global _inference_thread
    amqp_url = RABBITMQ_URL

    _inference_thread = threading.Thread(
        target=_run_inference_loop,
        args=(amqp_url,),
        daemon=True  # Automatically kills the thread when the main application exits
    )
    _inference_thread.start()
    print("[System] Background inference broker worker thread spawned safely.")


def stop_inference_worker():
    """
    Signals the inference thread worker to terminate network interface loops cleanly.
    """
    global _channel
    print("[System] Terminating background inference operations...")
    try:
        if _channel and _channel.is_open:
            _channel.stop_consuming()
    except Exception as e:
        print(f"Exception while stopping inference consumer: {e}")