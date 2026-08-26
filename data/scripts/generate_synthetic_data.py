"""
Synthetic Payment Event Generator for RevenueOS
Generates 10,000+ realistic payment failure events for training, evaluation, and simulation.
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import os
import uuid
from enum import Enum
from typing import List, Dict, Any

class PaymentMethod(Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    UPI = "upi"
    NET_BANKING = "net_banking"
    WALLET = "wallet"

class FailureType(Enum):
    INSUFFICIENT_FUNDS = "insufficient_funds"
    BANK_DECLINE = "bank_decline"
    AUTHENTICATION_FAILURE = "authentication_failure"
    EXPIRED_CARD = "expired_card"
    TEMPORARY_NETWORK_FAILURE = "temporary_network_failure"
    MERCHANT_CONFIGURATION = "merchant_configuration"
    CUSTOMER_ACTION_REQUIRED = "customer_action_required"
    UNKNOWN = "unknown"

class RecoveryStrategy(Enum):
    IMMEDIATE_RETRY = "immediate_retry"
    DELAYED_RETRY = "delayed_retry"
    ALTERNATE_PAYMENT_METHOD = "alternate_payment_method"
    PAYMENT_LINK = "payment_link"
    CUSTOMER_NOTIFICATION = "customer_notification"
    MANDATE_RETRY = "mandate_retry"
    HUMAN_REVIEW = "human_review"
    NO_ACTION = "no_action"

def generate_synthetic_data(n_events: int = 10000, seed: int = 42) -> pd.DataFrame:
    """
    Generate synthetic payment event data.
    
    Args:
        n_events: Number of events to generate (default 10,000)
        seed: Random seed for reproducibility
        
    Returns:
        DataFrame containing synthetic payment events
    """
    np.random.seed(seed)
    
    # Generate timestamps over the last 90 days
    end_date = datetime(2026, 8, 25, 12, 0, 0)
    start_date = end_date - timedelta(days=90)
    timestamps = [
        start_date + timedelta(seconds=int(s))
        for s in np.random.uniform(0, (end_date - start_date).total_seconds(), size=n_events)
    ]
    timestamps.sort()
    
    # Unique IDs
    transaction_ids = [f"TXN_{uuid.UUID(bytes=np.random.bytes(16)).hex[:10].upper()}" for _ in range(n_events)]
    
    n_customers = n_events // 8
    n_merchants = n_events // 40
    customer_ids = [f"CUST_{i+1000:04d}" for i in range(n_customers)]
    merchant_ids = [f"MERCH_{i+100:03d}" for i in range(n_merchants)]
    
    cust_assignment = np.random.choice(customer_ids, size=n_events)
    merch_assignment = np.random.choice(merchant_ids, size=n_events)
    
    # Transaction Amounts (Log-normal distribution around ₹2,500)
    amounts = np.random.lognormal(mean=7.5, sigma=1.0, size=n_events)
    amounts = np.round(np.clip(amounts, 100, 150000), 2)
    
    currencies = np.random.choice(["INR", "USD", "EUR"], size=n_events, p=[0.90, 0.07, 0.03])
    
    # Payment methods & failure types distribution
    payment_methods = np.random.choice(
        [m.value for m in PaymentMethod],
        size=n_events,
        p=[0.35, 0.25, 0.25, 0.10, 0.05]
    )
    
    failure_types = np.random.choice(
        [f.value for f in FailureType],
        size=n_events,
        p=[0.22, 0.18, 0.15, 0.08, 0.18, 0.05, 0.08, 0.06]
    )
    
    failure_reasons = []
    failure_codes = []
    for ftype in failure_types:
        if ftype == FailureType.INSUFFICIENT_FUNDS.value:
            reason = "Insufficient funds in customer account"
            code = "ERR_INSUFFICIENT_FUNDS"
        elif ftype == FailureType.BANK_DECLINE.value:
            reason = "Issuer bank declined transaction due to risk rules"
            code = "ERR_BANK_DECLINE"
        elif ftype == FailureType.AUTHENTICATION_FAILURE.value:
            reason = "Customer 3DS / OTP verification failed or timed out"
            code = "ERR_AUTH_FAILED"
        elif ftype == FailureType.EXPIRED_CARD.value:
            reason = "Instrument card has expired"
            code = "ERR_CARD_EXPIRED"
        elif ftype == FailureType.TEMPORARY_NETWORK_FAILURE.value:
            reason = "Temporary gateway network timeout or issuer degradation"
            code = "ERR_NETWORK_TIMEOUT"
        elif ftype == FailureType.MERCHANT_CONFIGURATION.value:
            reason = "Invalid merchant API credentials or routing config"
            code = "ERR_MERCHANT_CONFIG"
        elif ftype == FailureType.CUSTOMER_ACTION_REQUIRED.value:
            reason = "Customer mandate approval or biometric confirmation needed"
            code = "ERR_CUSTOMER_ACTION"
        else:
            reason = "Unknown upstream gateway failure"
            code = "ERR_UNKNOWN"
        failure_reasons.append(reason)
        failure_codes.append(code)
    
    retry_counts = np.random.choice([0, 1, 2, 3, 4], size=n_events, p=[0.55, 0.25, 0.12, 0.05, 0.03])
    
    # Customer history metrics
    base_success = np.random.beta(7, 2, size=n_events)
    historical_success_rate = np.round(np.clip(base_success, 0.15, 0.98), 3)
    previous_success_rate = np.round(np.clip(historical_success_rate + np.random.normal(0, 0.08, size=n_events), 0.05, 1.0), 3)
    
    customer_payment_frequency = np.random.poisson(lam=4, size=n_events) + 1
    previous_failures = np.random.binomial(n=6, p=1-historical_success_rate, size=n_events)
    
    device_types = np.random.choice(["mobile", "desktop", "tablet"], size=n_events, p=[0.65, 0.28, 0.07])
    device_os = np.random.choice(["iOS", "Android", "Windows", "macOS"], size=n_events, p=[0.35, 0.40, 0.15, 0.10])
    countries = np.random.choice(["IN", "US", "AE", "SG", "GB"], size=n_events, p=[0.85, 0.06, 0.04, 0.03, 0.02])
    subscription_status = np.random.choice(["active", "trial", "canceled", "none"], size=n_events, p=[0.50, 0.15, 0.10, 0.25])
    
    # Invoice Information
    invoice_info = [
        json.dumps({
            "invoice_id": f"INV_{uuid.UUID(bytes=np.random.bytes(16)).hex[:8].upper()}",
            "due_date": (timestamps[i] + timedelta(days=np.random.randint(1, 14))).strftime("%Y-%m-%d"),
            "items": int(np.random.randint(1, 4)),
            "tax": float(np.round(amounts[i] * 0.18, 2))
        })
        for i in range(n_events)
    ]
    
    amount_relative_to_hist_avg = np.round(np.random.gamma(shape=2.5, scale=0.5, size=n_events), 2)
    time_since_prev_success = np.round(np.random.exponential(scale=86400 * 4, size=n_events), 0)
    
    # Determine Ground Truth Recoverability
    # Logic: Temporary network failures, temporary declines, low retry counts, and high historical success rate -> High recoverability
    recoverability_score = (
        (df_ftype := np.isin(failure_types, [FailureType.TEMPORARY_NETWORK_FAILURE.value, FailureType.AUTHENTICATION_FAILURE.value, FailureType.BANK_DECLINE.value])).astype(float) * 0.35 +
        (retry_counts < 2).astype(float) * 0.25 +
        (historical_success_rate > 0.65).astype(float) * 0.25 +
        (payment_methods == PaymentMethod.UPI.value).astype(float) * 0.15 +
        (failure_types == FailureType.EXPIRED_CARD.value).astype(float) * -0.40 +
        (failure_types == FailureType.INSUFFICIENT_FUNDS.value).astype(float) * -0.20 +
        np.random.normal(0, 0.05, size=n_events)
    )
    
    recoverability_probability = np.round(np.clip(recoverability_score, 0.01, 0.99), 3)
    is_recoverable = (recoverability_probability >= 0.50).astype(int)
    expected_recovery_amount = np.where(is_recoverable == 1, np.round(amounts * recoverability_probability, 2), 0.0)
    
    df = pd.DataFrame({
        'transaction_id': transaction_ids,
        'customer_id': cust_assignment,
        'merchant_id': merch_assignment,
        'amount': amounts,
        'currency': currencies,
        'timestamp': [ts.isoformat() for ts in timestamps],
        'payment_method': payment_methods,
        'failure_type': failure_types,
        'failure_code': failure_codes,
        'failure_reason': failure_reasons,
        'retry_count': retry_counts,
        'customer_historical_success_rate': historical_success_rate,
        'previous_success_rate': previous_success_rate,
        'customer_payment_frequency': customer_payment_frequency,
        'previous_failures': previous_failures,
        'transaction_hour': [ts.hour for ts in timestamps],
        'day_of_week': [ts.weekday() for ts in timestamps],
        'subscription_status': subscription_status,
        'amount_relative_to_historical_avg': amount_relative_to_hist_avg,
        'time_since_previous_successful_payment': time_since_prev_success,
        'device_type': device_types,
        'device_os': device_os,
        'country': countries,
        'invoice_info': invoice_info,
        'is_recoverable': is_recoverable,
        'recoverability_probability': recoverability_probability,
        'expected_recovery_amount': expected_recovery_amount
    })
    
    return df

def save_data(df: pd.DataFrame, output_path: str = "data/synthetic_payments.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"✅ Generated and saved {len(df):,} synthetic payment events to {output_path}")

if __name__ == "__main__":
    df = generate_synthetic_data(n_events=10000, seed=42)
    save_data(df, "data/synthetic_payments.csv")
    
    print("\n=== Dataset Summary ===")
    print(f"Total Transactions: {len(df):,}")
    print(f"Recoverable Transactions: {df['is_recoverable'].sum():,} ({df['is_recoverable'].mean()*100:.2f}%)")
    print(f"Total Revenue at Risk: ₹{df['amount'].sum():,.2f}")
    print(f"Total Potential Recovery: ₹{df['expected_recovery_amount'].sum():,.2f}")
