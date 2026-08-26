"""
Deterministic Safety Policy Engine for RevenueOS.
Validates AI recommendations against business policies, risk constraints, and idempotency rules.
"""

from typing import Dict, Any
from app.core.config import settings

class PolicyEngine:
    """
    Deterministic rule engine enforcing safety-critical policies.
    Guarantees no invalid or unsafe payment interventions take place.
    """
    
    MAX_RETRIES = settings.MAX_RETRY_ATTEMPTS
    HIGH_VALUE_THRESHOLD = settings.HIGH_VALUE_THRESHOLD
    MIN_CONFIDENCE_THRESHOLD = settings.MIN_CONFIDENCE_THRESHOLD
    MIN_RECOVERABILITY_THRESHOLD = settings.MIN_RECOVERABILITY_THRESHOLD
    DEFAULT_INTERVENTION_COST = settings.DEFAULT_INTERVENTION_COST

    @classmethod
    def evaluate(
        cls, 
        payment: Dict[str, Any], 
        prediction: Dict[str, Any], 
        diagnosis: Dict[str, Any],
        executed_keys: set = None
    ) -> Dict[str, Any]:
        """
        Evaluate policy constraints against payment context and AI recommendations.
        """
        txn_id = payment.get("transaction_id", "")
        amount = payment.get("amount", 0.0)
        retry_count = payment.get("retry_count", 0)
        strategy = diagnosis.get("recommended_strategy", "delayed_retry")
        confidence = diagnosis.get("confidence", 1.0)
        proba = prediction.get("recoverability_probability", 0.5)
        expected_val = prediction.get("expected_recovery_value", amount * proba)
        
        idempotency_key = f"{txn_id}:{strategy}"
        
        # 1. Idempotency Check
        if executed_keys and idempotency_key in executed_keys:
            return {
                "decision": "BLOCKED",
                "reason": f"Idempotency protection block: Strategy '{strategy}' already executed for transaction {txn_id}.",
                "rule_applied": "IDEMPOTENCY_PROTECTION",
                "recommended_strategy": strategy,
                "is_idempotent": False,
                "idempotency_key": idempotency_key
            }
            
        # 2. Maximum Retries Limit
        if retry_count >= cls.MAX_RETRIES:
            return {
                "decision": "BLOCKED",
                "reason": f"Maximum retry limit reached ({retry_count} retries attempted). Allowed limit: MAX_RETRIES = {cls.MAX_RETRIES}.",
                "rule_applied": "MAX_RETRIES_EXCEEDED",
                "recommended_strategy": strategy,
                "is_idempotent": True,
                "idempotency_key": idempotency_key
            }
            
        # 3. High Value Transaction Check -> Send to Human Review
        if amount > cls.HIGH_VALUE_THRESHOLD:
            return {
                "decision": "HUMAN_REVIEW",
                "reason": f"High value transaction (₹{amount:,.2f}) exceeds auto-recovery threshold (₹{cls.HIGH_VALUE_THRESHOLD:,.2f}). Human review required.",
                "rule_applied": "HIGH_VALUE_THRESHOLD",
                "recommended_strategy": strategy,
                "is_idempotent": True,
                "idempotency_key": idempotency_key
            }
            
        # 4. Low AI Diagnosis Confidence -> Send to Human Review
        if confidence < cls.MIN_CONFIDENCE_THRESHOLD:
            return {
                "decision": "HUMAN_REVIEW",
                "reason": f"AI diagnosis confidence ({confidence:.2f}) is below safe threshold ({cls.MIN_CONFIDENCE_THRESHOLD:.2f}). Escalate to human review.",
                "rule_applied": "LOW_CONFIDENCE_THRESHOLD",
                "recommended_strategy": strategy,
                "is_idempotent": True,
                "idempotency_key": idempotency_key
            }
            
        # 5. Low Recoverability Probability -> Block Unnecessary Intervention
        if proba < cls.MIN_RECOVERABILITY_THRESHOLD:
            return {
                "decision": "BLOCKED",
                "reason": f"Recoverability probability ({proba:.2f}) is below minimum viable threshold ({cls.MIN_RECOVERABILITY_THRESHOLD:.2f}).",
                "rule_applied": "MIN_RECOVERABILITY_THRESHOLD",
                "recommended_strategy": strategy,
                "is_idempotent": True,
                "idempotency_key": idempotency_key
            }
            
        # 6. Negative Expected ROI (Expected Recovery < Intervention Cost)
        if expected_val < cls.DEFAULT_INTERVENTION_COST:
            return {
                "decision": "BLOCKED",
                "reason": f"Expected recovery value (₹{expected_val:.2f}) is lower than intervention cost (₹{cls.DEFAULT_INTERVENTION_COST:.2f}). Negative ROI.",
                "rule_applied": "NEGATIVE_INTERVENTION_ROI",
                "recommended_strategy": strategy,
                "is_idempotent": True,
                "idempotency_key": idempotency_key
            }

        # 7. Unserviceable failure type
        ftype = payment.get("failure_type", "")
        if ftype == "merchant_configuration":
            return {
                "decision": "HUMAN_REVIEW",
                "reason": "Merchant configuration failure requires human engineering intervention.",
                "rule_applied": "MERCHANT_CONFIG_ESCALATION",
                "recommended_strategy": strategy,
                "is_idempotent": True,
                "idempotency_key": idempotency_key
            }

        # All policies passed!
        return {
            "decision": "ALLOWED",
            "reason": "All safety policies passed successfully.",
            "rule_applied": "POLICY_PASSED",
            "recommended_strategy": strategy,
            "is_idempotent": True,
            "idempotency_key": idempotency_key
        }

policy_engine = PolicyEngine()
