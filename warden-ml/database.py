import os
import pandas as pd
import psycopg2


def extract_training_dataset(table_name: str) -> pd.DataFrame:
    """
    Executes a high-speed relational matrix dump from PostgreSQL,
    streaming rows straight into a pandas DataFrame layout.
    """
    print(f"Initializing database extraction pass for table workspace: {table_name}...")

    # Fallback to local defaults if environment variables aren't injected yet
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_NAME", "warden"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "root")
    )

    try:
        query = f"SELECT * FROM {table_name};"

        # Fetching all columns from table, but not all are required for training
        df = pd.read_sql_query(query, conn)
        print(f"Extraction Matrix Verified: Pulled {len(df)} entries successfully.")

        # TARGET MACHINE LEARNING FEATURE SELECTION MATRIX

        target_training_features = [
            # Base demographic and account core features
            "acc_type",
            "acc_age",
            "flagged_txns",
            "txn_amt",
            "merchant_type",

            # Feature Engineered features
            "geo_country_mismatch",
            "geo_distance_km",
            "speed_kmh",
            "time_gap_last_txn",
            "high_txn_velocity",
            "user_atv_delta",
            "is_new_device",
            "is_abnormal_time",
            "fraud_score"
        ]

        # Only attempt to slice columns that actually exist in the DB schema
        available_features = [col for col in target_training_features if col in df.columns]

        # Slice the dataframe matrix down to your exact feature profile
        filtered_df = df[available_features]

        print(f"Feature Selection Complete: Kept {len(available_features)} model columns. "
              f"Dropped raw spatial/timestamp metadata columns.")

        return filtered_df

    finally:
        conn.close()