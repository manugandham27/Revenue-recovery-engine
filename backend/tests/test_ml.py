"""
Unit tests for ML Recoverability Model & Feature Preprocessing.
"""

import pytest
import os
import joblib
import pandas as pd
import numpy as np

def test_model_files_exist():
    model_path = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "model.joblib")
    meta_path = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "model_metadata.json")
    assert os.path.exists(model_path), "Model joblib binary missing"
    assert os.path.exists(meta_path), "Model metadata json missing"

def test_model_prediction_range():
    model_path = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "model.joblib")
    meta_path = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "model_metadata.json")
    
    model = joblib.load(model_path)
    import json
    with open(meta_path, 'r') as f:
        meta = json.load(f)
    
    feature_names = meta.get("feature_names", [])
    assert len(feature_names) > 0, "No features in metadata"
    
    # Create test sample input vector
    X_dummy = pd.DataFrame(np.zeros((1, len(feature_names))), columns=feature_names)
    proba = model.predict_proba(X_dummy)[0, 1]
    
    assert 0.0 <= proba <= 1.0, f"Predicted probability {proba} out of range [0, 1]"
