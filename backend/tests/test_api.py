"""
API Integration & Endpoint Verification Tests for RevenueOS.
"""

import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_reset_and_run():
    response = client.post("/api/v1/demo/reset-and-run")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["processed_events"] > 0

def test_get_metrics():
    response = client.get("/api/v1/recovery/metrics")
    assert response.status_code == 200
    metrics = response.json()
    assert "total_revenue_at_risk" in metrics
    assert "total_revenue_recovered" in metrics
    assert "recovery_rate" in metrics

def test_baseline_comparison():
    response = client.get("/api/v1/recovery/baseline-comparison")
    assert response.status_code == 200
    res = response.json()
    assert "baseline" in res
    assert "revenue_os" in res
    assert "impact" in res

def test_strategy_optimization():
    response = client.get("/api/v1/recovery/strategies")
    assert response.status_code == 200
    res = response.json()
    assert "failure_matrix" in res

def test_human_review_and_audit():
    res_hr = client.get("/api/v1/human-review")
    assert res_hr.status_code == 200
    
    res_audit = client.get("/api/v1/audit")
    assert res_audit.status_code == 200
