import os
import joblib
import pandas as pd
import numpy as np
import json
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

# CATEGORICAL CONTRACT
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

def execute_model_training_lifecycle(data_frame: pd.DataFrame):
    """
    Splits data, processes categorical boundaries, compiles a LightGBM
    binary classifier, and persists the weights to disk.
    """
    print("\n[ML Pipeline] Starting model training lifecycle...")

    if data_frame.empty or len(data_frame) < 1000:
        print("[ML Pipeline] Dataset size insufficient for meaningful training passes. Aborting.")
        return

    # 1. ESTABLISH TARGET LABEL BINARY CONVERSION
    # Transform continuous fraud score probabilities into definitive binary label classes
    data_frame['is_fraud'] = (data_frame['fraud_score'] >= 0.8).astype(int)

    # Separate target vectors from feature space matrices
    X = data_frame.drop(columns=['fraud_score', 'is_fraud'])
    y = data_frame['is_fraud']

    # 2. CONVERT NOMINAL STRING ATTRIBUTES
    # # Casting to category types tells LightGBM to use optimal partition algorithms instead of slow numerical conversions
    # categorical_features = ["acc_type", "merchant_type"]
    # for col in categorical_features:
    #     if col in X.columns:
    #         X[col] = X[col].astype('category')  # TODO
    print("[ML Pipeline] Transforming nominal properties to explicit integer contracts...")

    if 'acc_type' in X.columns:
        # Force uppercase, map strings to exact codes, fill gaps, cast to category dtype
        X['acc_type'] = X['acc_type'].astype(str).str.upper().map(ACC_TYPE_MAP).fillna(1).astype('category')

    if 'merchant_type' in X.columns:
        X['merchant_type'] = X['merchant_type'].astype(str).str.upper().map(MERCHANT_TYPE_MAP).fillna(0).astype('category')

    # Ensure boolean attributes map to consistent model parameters
    boolean_features = ["geo_country_mismatch", "high_txn_velocity", "is_new_device", "is_abnormal_time"]
    for col in boolean_features:
        if col in X.columns:
            X[col] = X[col].astype(int)

    # 3. COMPUTE FRAUD RISK CHARACTERISTICS FOR TRAIN-TEST STRATIFIED SPLITS
    # stratify=y guarantees test splits contain identical fraud ratios as training pools
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )
    print(f"Training Matrix Boundaries: {X_train.shape[0]} samples")
    print(f"Validation Evaluation Pools: {X_test.shape[0]} samples")

    # 4. INSTANTIATE OPTIMIZED TREE GRADIENT BOOSTING HYPER-PARAMETERS
    # scale_pos_weight compensates for imbalanced datasets (few fraud rows compared to legitimate entries)
    negative_class_count = (y_train == 0).sum()
    positive_class_count = (y_train == 1).sum()
    imbalance_ratio = negative_class_count / max(1, positive_class_count)

    model_params = {
        'objective': 'binary',
        'metric': 'auc',
        'boosting_type': 'gbdt',
        'learning_rate': 0.05,
        'num_leaves': 31,
        'max_depth': 6,
        'scale_pos_weight': max(1.0, imbalance_ratio),
        'verbosity': -1,
        'random_state': 42
    }

    print("[ML Pipeline] Fitting LightGBM Decision Trees...")
    classifier = lgb.LGBMClassifier(**model_params)
    classifier.fit(X_train, y_train)

    # 5. EXECUTE VALIDATION SCORES MATRIX RECORDINGS
    y_predictions = classifier.predict(X_test)
    y_probabilities = classifier.predict_proba(X_test)[:, 1]

    auc_score = roc_auc_score(y_test, y_probabilities)
    print("\n[ML Pipeline] Validation Evaluation Metrics Matrix:")
    print(f"Area Under ROC Curve (ROC-AUC): {auc_score:.4f}")
    print("\n--- Classification Performance Grid ---")
    print(classification_report(y_test, y_predictions, target_names=["LEGIT", "FRAUD"]))

    print("--- Confusion Matrix Layout ---")
    tn, fp, fn, tp = confusion_matrix(y_test, y_predictions).ravel()
    print(f"True Negatives (Legit Caught): {tn}  | False Positives (False Alarms): {fp}")
    print(f"False Negatives (Missed Fraud): {fn} | True Positives (Fraud Caught): {tp}\n")

    recall = (tp/(tp + fn)) * 100
    false_alarm_rate = (fp/(tn + fp))* 100

    print(f"Successful Fraud Detection Rate: {recall} %")
    print(f"False Alarm Rate: {false_alarm_rate} %")

    # 6. MODEL ARTIFACT SERIALIZATION FOR FUTURES PRODUCTION SERVICE INFERENCE
    models_output_dir = "./models"
    os.makedirs(models_output_dir, exist_ok=True)
    model_weight_path = os.path.join(models_output_dir, "warden_lightgbm_model.pkl")

    # Save model weights to file system
    joblib.dump(classifier, model_weight_path)
    print(f"[ML Pipeline] Serialized model successfully saved to disk: {model_weight_path}\n")

    # BUILD METRICS DICTIONARY
    metrics = {
        "legit_caught": int(tn),  # Explicitly cast numpy integers to standard python ints for clean JSON mapping
        "false_alarms": int(fp),
        "missed_fraud": int(fn),
        "fraud_caught": int(tp),
        "false_alarm_rate": float(round(false_alarm_rate, 2)),
        "recall": float(round(recall, 2)),
        "auc_roc": float(round(auc_score, 4)),
        "total_training_samples": len(data_frame)
    }


    # SERIALIZE METRICS DICTIONARY TO A JSON FILE
    metrics_output_path = os.path.join(models_output_dir, "evaluation_metrics.json")
    with open(metrics_output_path, "w", encoding="utf-8") as json_file:
        json.dump(metrics, json_file, indent=4)
    print(f"[ML Pipeline] Saved evaluation metric states to disk: {metrics_output_path}\n")

    return metrics