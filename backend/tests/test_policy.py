"""
Unit tests for Deterministic Safety Policy Engine.
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.core.policy_engine import PolicyEngine

def test_max_retries_limit():
    payment = {"transaction_id": "TXN_001", "amount": 1000.0, "retry_count": 3}
    prediction = {"recoverability_probability": 0.8, "expected_recovery_value": 800.0}
    diagnosis = {"recommended_strategy": "immediate_retry", "confidence": 0.9}
    
    result = PolicyEngine.evaluate(payment, prediction, diagnosis)
    assert result["decision"] == "BLOCKED"
    assert result["rule_applied"] == "MAX_RETRIES_EXCEEDED"

def test_high_value_transaction():
    payment = {"transaction_id": "TXN_HIGH", "amount": 100000.0, "retry_count": 0}
    prediction = {"recoverability_probability": 0.8, "expected_recovery_value": 80000.0}
    diagnosis = {"recommended_strategy": "delayed_retry", "confidence": 0.9}
    
    result = PolicyEngine.evaluate(payment, prediction, diagnosis)
    assert result["decision"] == "HUMAN_REVIEW"
    assert result["rule_applied"] == "HIGH_VALUE_THRESHOLD"

def test_low_confidence_escalation():
    payment = {"transaction_id": "TXN_LOW_CONF", "amount": 2500.0, "retry_count": 0}
    prediction = {"recoverability_probability": 0.5, "expected_recovery_value": 1250.0}
    diagnosis = {"recommended_strategy": "delayed_retry", "confidence": 0.45}
    
    result = PolicyEngine.evaluate(payment, prediction, diagnosis)
    assert result["decision"] == "HUMAN_REVIEW"
    assert result["rule_applied"] == "LOW_CONFIDENCE_THRESHOLD"

def test_idempotency_block():
    executed_keys = {"TXN_DUP:delayed_retry"}
    payment = {"transaction_id": "TXN_DUP", "amount": 1500.0, "retry_count": 0}
    prediction = {"recoverability_probability": 0.8, "expected_recovery_value": 1200.0}
    diagnosis = {"recommended_strategy": "delayed_retry", "confidence": 0.9}
    
    result = PolicyEngine.evaluate(payment, prediction, diagnosis, executed_keys)
    assert result["decision"] == "BLOCKED"
    assert result["rule_applied"] == "IDEMPOTENCY_PROTECTION"
