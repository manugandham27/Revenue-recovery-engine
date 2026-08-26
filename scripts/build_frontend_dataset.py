import pandas as pd
import json

# Load synthetic payments CSV
df = pd.read_csv("data/synthetic_payments.csv")

# Select 500 transactions for rich dataset
sample_df = df.head(500)

transactions = []
human_reviews = []
audit_logs = []

strategies_map = {
    "temporary_network_failure": "delayed_retry",
    "expired_card": "alternate_payment_method",
    "authentication_failure": "customer_notification",
    "insufficient_funds": "payment_link",
    "bank_decline": "delayed_retry",
    "customer_action_required": "mandate_retry",
    "merchant_configuration": "route_fallback",
    "unknown": "delayed_retry"
}

review_idx = 1
log_idx = 1

for idx, row in sample_df.iterrows():
    t_id = idx + 1
    amount = round(float(row["amount"]), 2)
    proba = round(float(row["recoverability_probability"]), 3)
    exp_val = round(amount * proba, 2)
    f_type = str(row["failure_type"])
    strat = strategies_map.get(f_type, "delayed_retry")
    retry_count = int(row["retry_count"])
    
    # Realistic policy classification rules
    if retry_count >= 3:
        status = "BLOCKED"
        policy_decision = "BLOCKED"
        policy_reason = f"Retry limit exceeded ({retry_count} retries attempted >= 3 max limit)"
    elif amount > 30000 or (proba < 0.50 and amount > 10000):
        status = "HUMAN_REVIEW"
        policy_decision = "HUMAN_REVIEW"
        policy_reason = f"High transaction amount (₹{amount:,.2f}) or low AI confidence ({int(proba*100)}%) requires human operator review"
    elif row["is_recoverable"] == 1:
        status = "EXECUTED"
        policy_decision = "ALLOWED"
        policy_reason = "All policy checks passed (Retry limit OK, Idempotency OK, Confidence OK)"
    else:
        status = "BLOCKED"
        policy_decision = "BLOCKED"
        policy_reason = "Low AI recoverability score (<40%) - policy safety block"

    txn = {
        "id": t_id,
        "transaction_id": str(row["transaction_id"]),
        "customer_id": str(row["customer_id"]),
        "merchant_id": str(row["merchant_id"]),
        "amount": amount,
        "currency": str(row["currency"]),
        "timestamp": str(row["timestamp"]),
        "payment_method": str(row["payment_method"]),
        "failure_type": f_type,
        "failure_reason": str(row["failure_reason"]),
        "retry_count": retry_count,
        "status": status,
        "customer_historical_success_rate": float(row["customer_historical_success_rate"]),
        "previous_success_rate": float(row["previous_success_rate"]),
        "device_type": str(row["device_type"]),
        "device_os": str(row["device_os"]),
        "country": str(row["country"]),
        "recoverability_probability": proba,
        "expected_recovery_value": exp_val,
        "recommended_strategy": strat,
        "policy_decision": policy_decision,
        "policy_reason": policy_reason,
        "revenue_recovered": amount if status == "EXECUTED" else 0.0,
        "action_succeeded": status == "EXECUTED"
    }
    transactions.append(txn)

    # Human review cases (realistic proportion ~4% of transactions)
    if status == "HUMAN_REVIEW":
        human_reviews.append({
            "review_id": review_idx,
            "payment_id": t_id,
            "transaction_id": str(row["transaction_id"]),
            "customer_id": str(row["customer_id"]),
            "amount": amount,
            "failure_type": f_type,
            "flag_reason": policy_reason,
            "ai_recommendation": strat,
            "ai_confidence": proba,
            "status": "PENDING",
            "human_decision": None,
            "override_reason": None,
            "reviewed_by": None,
            "created_at": str(row["timestamp"])
        })
        review_idx += 1

    # Full compliance audit trail: 4 events per transaction (500 * 4 = 2,000 logs)
    audit_logs.append({
        "id": log_idx,
        "payment_id": t_id,
        "transaction_id": str(row["transaction_id"]),
        "event_type": "INGESTION",
        "actor": "SYSTEM",
        "summary": f"Ingested payment failure event {row['transaction_id']} (Amount: ₹{amount})",
        "timestamp": str(row["timestamp"])
    })
    log_idx += 1
    audit_logs.append({
        "id": log_idx,
        "payment_id": t_id,
        "transaction_id": str(row["transaction_id"]),
        "event_type": "ANALYSIS",
        "actor": "ML_MODEL & LLM_DIAGNOSIS",
        "summary": f"Predicted recoverability {int(proba * 100)}% (Expected ₹{exp_val}). Diagnosed cause: '{f_type}'",
        "timestamp": str(row["timestamp"])
    })
    log_idx += 1
    audit_logs.append({
        "id": log_idx,
        "payment_id": t_id,
        "transaction_id": str(row["transaction_id"]),
        "event_type": "POLICY_CHECK",
        "actor": "POLICY_ENGINE",
        "summary": f"Policy decision: {policy_decision}. Reason: {policy_reason}",
        "timestamp": str(row["timestamp"])
    })
    log_idx += 1
    audit_logs.append({
        "id": log_idx,
        "payment_id": t_id,
        "transaction_id": str(row["transaction_id"]),
        "event_type": "EXECUTION",
        "actor": "SIMULATION_ENGINE",
        "summary": f"Executed strategy '{strat}'. Outcome: {'SUCCESS' if status == 'EXECUTED' else 'BLOCKED'}",
        "timestamp": str(row["timestamp"])
    })
    log_idx += 1

output_path = "frontend/src/lib/dataset.json"
with open(output_path, "w") as f:
    json.dump({
        "total_csv_records": len(df),
        "transactions": transactions,
        "human_reviews": human_reviews,
        "audit_logs": audit_logs
    }, f, indent=2)

print(f"Successfully generated realistic fintech dataset: {len(transactions)} transactions, {len(human_reviews)} escalated human review cases, and {len(audit_logs)} audit logs!")
