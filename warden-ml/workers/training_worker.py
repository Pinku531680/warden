import os
import json
import threading
import pika
from database import extract_training_dataset
from pipeline.training import execute_model_training_lifecycle

# Keep track of the connection thread and active channel globally for clean operations
_worker_thread = None
_channel = None


def save_dataframe_to_disk(df, table_name):
    """
    Writes the extracted dataframe to disk in two optimized formats.
    """
    output_dir = "./data"
    os.makedirs(output_dir, exist_ok=True)

    csv_path = os.path.join(output_dir, f"{table_name}.csv")
    parquet_path = os.path.join(output_dir, f"{table_name}.parquet")

    txt_path = os.path.join(output_dir, f"{table_name}_aligned.txt")

    print(f"[Worker] Flushing data arrays to local disk storage...")

    # Human-readable CSV snapshot
    df.to_csv(csv_path, index=False)
    print(f">>CSV stored successfully: {csv_path}")

    # High-throughput compressed binary Parquet matrix for model training
    df.to_parquet(parquet_path, engine="pyarrow", compression="snappy", index=False)
    print(f">>High-speed Parquet data matrix compiled: {parquet_path}")

    # NEW: Pretty-printed space-separated text file for quick text-editor viewing
    with open(txt_path, "w", encoding="utf-8") as f:
        # to_string handles all the padding math automatically so values line up perfectly under titles
        f.write(df.to_string(index=False))
    print(f"   ↳ Visually aligned inspection snapshot stored: {txt_path}")


def on_training_trigger_received(ch, method, properties, body):
    """
    Callback executed when Spring Boot publishes the completion notification.
    """
    try:
        event_payload = json.loads(body.decode('utf-8'))
        print(f"\n[Worker] Intercepted Ingestion Lifecycle Event: {event_payload}")

        if event_payload.get("status") == "COMPLETED":
            target_table = event_payload.get("targetTable", "transactions_training")
            print(f"[Worker] Ingestion verified. Freezing database table target: {target_table}")

            # 1. Non-blocking extraction pass from Postgres via pandas
            dataset_df = extract_training_dataset(target_table)

            # 2. Flush data frame records out to files on disk
            save_dataframe_to_disk(dataset_df, target_table)
            print("[Worker] Training file extraction loop completed successfully.")

            # # NEW AUTOMATED TRIGGER HOOK: RUNS MODEL TRAINING INSTANTLY ON DATA ARRIVAL
            # print("[Worker] Executing training lifecycle on dataset.")
            # execute_model_training_lifecycle(dataset_df)
            # print("[Worker] End-to-end simulation training thread loop finalized.")

    except Exception as fault:
        print(f"[Worker] Critical processing failure inside trigger block: {fault}")


def _run_consumer_loop(amqp_url: str):
    """
    The internal blocking network loop running inside the daemon thread.
    """
    global _channel
    try:
        print("[Worker] Initializing background AMQP listener connection...")
        params = pika.URLParameters(amqp_url)
        connection = pika.BlockingConnection(params)
        _channel = connection.channel()

        # Infrastructure declarations (Saves state parity with Spring Boot profiles)
        _channel.exchange_declare(exchange='warden.training.exchange', exchange_type='topic', durable=True)
        queue_name = 'warden.training.trigger.queue'
        _channel.queue_declare(queue=queue_name, durable=True)
        _channel.queue_bind(exchange='warden.training.exchange', queue=queue_name,
                           routing_key='warden.training.completed')

        _channel.basic_consume(queue=queue_name, on_message_callback=on_training_trigger_received, auto_ack=True)

        print(f"[Worker] Consumer attached to queue [{queue_name}]. Listening...")

        # BULLETPROOF: Use native start_consuming loop to avoid dropping cloud frames
        _channel.start_consuming()

    except pika.exceptions.AMQPConnectionError:
        print("⚠[Worker] CloudAMQP connection broken or closed safely.")
    except Exception as err:
        print(f"[Worker] Unexpected loop termination exception: {err}")
    finally:
        print("[Worker] Background consumer channel closed.")


def start_training_worker():
    """
    Spins up the CloudAMQP consumer loop inside a safe background daemon thread.
    """
    global _worker_thread
    amqp_url = os.getenv("RABBITMQ_URL", "amqps://ovksenqm:V-nNSY3rs-0gH8XGtSD23uilwUxNyQZE@dingo.rmq.cloudamqp.com/ovksenqm")

    _worker_thread = threading.Thread(
        target=_run_consumer_loop,
        args=(amqp_url,),
        daemon=True  # Daemon status automatically cleans up the thread when FastAPI exits
    )
    _worker_thread.start()
    print("[System] Background message broker worker thread spawned safely.")


def stop_training_worker():
    """
    Signals the thread worker to close open network interfaces down cleanly.
    """
    global _channel
    print("⏹ [System] Terminating background thread operations...")
    try:
        if _channel and _channel.is_open:
            # Safe asynchronous command to cleanly break the start_consuming socket loop
            _channel.stop_consuming()
    except Exception as e:
        print(f"⚠Exception while stopping consumer: {e}")