"""
ML Model Training for RevenueOS
Trains a recoverability prediction model on synthetic payment data.
Saves model binary, feature list, and evaluation metrics.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import joblib
import json
import os
from datetime import datetime

def load_data(data_path: str = "data/synthetic_payments.csv") -> pd.DataFrame:
    """Load synthetic payment data."""
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at {data_path}. Please run generate_synthetic_data.py first.")
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    return df

def preprocess_features(df: pd.DataFrame):
    """
    Preprocess features for ML model using one-hot encoding for categorical variables
    and log transformation for skewed numeric features.
    
    Returns:
        X: feature matrix
        y: target vector (is_recoverable)
        feature_names: list of feature names
    """
    df_proc = df.copy()
    
    # Transform skewed numeric features
    df_proc['log_amount'] = np.log1p(df_proc['amount'])
    df_proc['log_time_since_prev_success'] = np.log1p(df_proc['time_since_previous_successful_payment'])
    
    numeric_cols = [
        'log_amount',
        'retry_count',
        'customer_historical_success_rate',
        'previous_success_rate',
        'customer_payment_frequency',
        'previous_failures',
        'transaction_hour',
        'day_of_week',
        'amount_relative_to_historical_avg',
        'log_time_since_prev_success'
    ]
    
    categorical_cols = [
        'payment_method',
        'failure_type',
        'subscription_status',
        'currency',
        'device_type',
        'device_os',
        'country'
    ]
    
    # One-hot encoding
    df_encoded = pd.get_dummies(df_proc[numeric_cols + categorical_cols], columns=categorical_cols, prefix_sep='_')
    
    feature_names = list(df_encoded.columns)
    X = df_encoded.astype(float)
    y = df['is_recoverable'].values
    
    return X, y, feature_names

def train_model(X_train, y_train):
    """Train Gradient Boosting Classifier."""
    model = GradientBoostingClassifier(
        n_estimators=150,
        learning_rate=0.08,
        max_depth=4,
        subsample=0.85,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance on held-out test set."""
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred)),
        'recall': float(recall_score(y_test, y_pred)),
        'f1': float(f1_score(y_test, y_pred)),
        'roc_auc': float(roc_auc_score(y_test, y_pred_proba)),
        'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
    }
    return metrics, y_pred, y_pred_proba

def save_model(model, feature_names, metrics, model_path="ml/model.joblib"):
    """Save trained model binary and metadata."""
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    joblib.dump(model, model_path)
    
    metadata = {
        'model_name': 'GradientBoostingClassifier',
        'version': '1.0.0',
        'trained_at': datetime.now().isoformat(),
        'n_features': len(feature_names),
        'feature_names': feature_names,
        'metrics': metrics
    }
    
    metadata_path = model_path.replace('.joblib', '_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
        
    importances = model.feature_importances_
    feature_importance = [
        {"feature": name, "importance": float(imp)}
        for name, imp in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
    ]
    
    importance_path = os.path.join(os.path.dirname(model_path), "feature_importance.json")
    with open(importance_path, 'w') as f:
        json.dump(feature_importance, f, indent=2)
        
    print(f"✅ Saved model to {model_path}")
    print(f"✅ Saved metadata to {metadata_path}")
    print(f"✅ Saved feature importances to {importance_path}")

def main():
    print("Loading synthetic payment dataset...")
    df = load_data()
    print(f"Loaded {len(df):,} records.")
    
    X, y, feature_names = preprocess_features(df)
    
    # Train / Test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f"Training set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")
    print("Training Gradient Boosting model...")
    model = train_model(X_train, y_train)
    
    print("Evaluating model performance on held-out test set...")
    metrics, y_pred, y_pred_proba = evaluate_model(model, X_test, y_test)
    
    print("\n=== Held-Out Test Evaluation Metrics ===")
    print(f"Accuracy:  {metrics['accuracy']:.4f}")
    print(f"Precision: {metrics['precision']:.4f}")
    print(f"Recall:    {metrics['recall']:.4f}")
    print(f"F1 Score:  {metrics['f1']:.4f}")
    print(f"ROC-AUC:   {metrics['roc_auc']:.4f}")
    
    save_model(model, feature_names, metrics)

if __name__ == "__main__":
    main()
