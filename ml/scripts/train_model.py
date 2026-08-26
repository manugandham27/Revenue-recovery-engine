"""
ML Model Training & Model Comparison Pipeline for RevenueOS
Trains and compares Logistic Regression, Random Forest, and Gradient Boosting Classifiers.
Saves model binary, feature list, model comparison benchmarks, and evaluation metrics.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, average_precision_score, confusion_matrix
)
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
    
    Prevents data leakage by excluding downstream target indicators.
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

def train_and_compare_models(X_train, y_train, X_test, y_test):
    """
    Train and evaluate Logistic Regression, Random Forest, and Gradient Boosting models
    using 5-Fold Stratified Cross-Validation and held-out test evaluation.
    """
    models = {
        "LogisticRegression": LogisticRegression(max_iter=1000, random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=150, learning_rate=0.08, max_depth=4, subsample=0.85, random_state=42)
    }
    
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    comparison_results = {}
    
    best_model = None
    best_auc = 0.0
    best_name = ""

    for name, model in models.items():
        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=skf, scoring='roc_auc')
        
        # Fit model
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1]
        
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred))
        rec = float(recall_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred))
        roc_auc = float(roc_auc_score(y_test, y_proba))
        pr_auc = float(average_precision_score(y_test, y_proba))
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        comparison_results[name] = {
            "cv_mean_roc_auc": round(float(np.mean(cv_scores)), 4),
            "cv_std_roc_auc": round(float(np.std(cv_scores)), 4),
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "pr_auc": round(pr_auc, 4),
            "confusion_matrix": cm
        }
        
        if roc_auc > best_auc:
            best_auc = roc_auc
            best_model = model
            best_name = name

    return best_model, best_name, comparison_results

def save_model_artifacts(best_model, best_name, feature_names, comparison_results, metrics, model_path="ml/model.joblib"):
    """Save trained best model binary, metadata, and model comparisons."""
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    joblib.dump(best_model, model_path)
    
    metadata = {
        'best_model_name': best_name,
        'version': '1.1.0',
        'trained_at': datetime.now().isoformat(),
        'benchmark_context': 'Synthetic Held-Out Benchmark Data (20% Split, 2,000 Samples)',
        'n_features': len(feature_names),
        'feature_names': feature_names,
        'metrics': metrics,
        'model_comparisons': comparison_results
    }
    
    metadata_path = model_path.replace('.joblib', '_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
        
    comparison_path = os.path.join(os.path.dirname(model_path), "model_comparison.json")
    with open(comparison_path, 'w') as f:
        json.dump(comparison_results, f, indent=2)
        
    importances = best_model.feature_importances_ if hasattr(best_model, 'feature_importances_') else np.zeros(len(feature_names))
    feature_importance = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
    ]
    
    importance_path = os.path.join(os.path.dirname(model_path), "feature_importance.json")
    with open(importance_path, 'w') as f:
        json.dump(feature_importance, f, indent=2)
        
    print(f"✅ Saved best model ({best_name}) to {model_path}")
    print(f"✅ Saved metadata to {metadata_path}")
    print(f"✅ Saved model comparisons to {comparison_path}")
    print(f"✅ Saved feature importances to {importance_path}")

def main():
    print("Loading synthetic payment dataset...")
    df = load_data()
    print(f"Loaded {len(df):,} synthetic payment failure records.")
    
    X, y, feature_names = preprocess_features(df)
    
    # Train / Test split (80/20) with Stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f"Training set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")
    print("Training and benchmarking models (Logistic Regression, Random Forest, Gradient Boosting)...")
    
    best_model, best_name, comparison_results = train_and_compare_models(X_train, y_train, X_test, y_test)
    best_metrics = comparison_results[best_name]
    
    print(f"\n=== Model Comparison Results (Synthetic Benchmark) ===")
    for model_name, res in comparison_results.items():
        print(f"[{model_name}] 5-Fold CV ROC-AUC: {res['cv_mean_roc_auc']:.4f} | Test ROC-AUC: {res['roc_auc']:.4f} | PR-AUC: {res['pr_auc']:.4f} | F1: {res['f1_score']:.4f}")
        
    save_model_artifacts(best_model, best_name, feature_names, comparison_results, best_metrics)

if __name__ == "__main__":
    main()
