"""
SQLAlchemy Relational Database Models for RevenueOS.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .session import Base

class PaymentEventModel(Base):
    __tablename__ = "payment_events"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(64), unique=True, index=True, nullable=False)
    customer_id = Column(String(64), index=True, nullable=False)
    merchant_id = Column(String(64), index=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    payment_method = Column(String(32), index=True)
    failure_type = Column(String(64), index=True)
    failure_code = Column(String(64))
    failure_reason = Column(Text)
    retry_count = Column(Integer, default=0)
    
    customer_historical_success_rate = Column(Float, default=0.5)
    previous_success_rate = Column(Float, default=0.5)
    customer_payment_frequency = Column(Integer, default=1)
    previous_failures = Column(Integer, default=0)
    
    transaction_hour = Column(Integer, default=12)
    day_of_week = Column(Integer, default=0)
    subscription_status = Column(String(32), default="none")
    amount_relative_to_historical_avg = Column(Float, default=1.0)
    time_since_previous_successful_payment = Column(Float, default=0.0)
    
    device_type = Column(String(32), default="mobile")
    device_os = Column(String(32), default="Android")
    country = Column(String(10), default="IN")
    invoice_info = Column(Text, nullable=True)
    
    # Status tracking
    status = Column(String(32), default="INGESTED", index=True)  # INGESTED, ANALYZED, DECIDED, EXECUTED, HUMAN_REVIEW, BLOCKED
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    prediction = relationship("PredictionModel", back_populates="payment", uselist=False)
    diagnosis = relationship("DiagnosisModel", back_populates="payment", uselist=False)
    policy_decision = relationship("PolicyDecisionModel", back_populates="payment", uselist=False)
    recovery_action = relationship("RecoveryActionModel", back_populates="payment", uselist=False)
    outcome = relationship("OutcomeModel", back_populates="payment", uselist=False)
    human_review = relationship("HumanReviewModel", back_populates="payment", uselist=False)
    audit_logs = relationship("AuditLogModel", back_populates="payment")


class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payment_events.id"), unique=True, nullable=False)
    recoverability_probability = Column(Float, nullable=False)
    expected_recovery_value = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    model_version = Column(String(32), default="1.0.0")
    risk_tier = Column(String(16), index=True)  # HIGH, MEDIUM, LOW
    created_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("PaymentEventModel", back_populates="prediction")


class DiagnosisModel(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payment_events.id"), unique=True, nullable=False)
    root_cause = Column(String(64), nullable=False)
    reasoning_summary = Column(Text, nullable=False)
    recommended_strategy = Column(String(64), nullable=False)
    confidence = Column(Float, nullable=False)
    provider_used = Column(String(32), default="MOCK")  # OPENAI, GEMINI, MOCK_FALLBACK
    created_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("PaymentEventModel", back_populates="diagnosis")


class PolicyDecisionModel(Base):
    __tablename__ = "policy_decisions"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payment_events.id"), unique=True, nullable=False)
    recommended_strategy = Column(String(64), nullable=False)
    decision = Column(String(32), nullable=False)  # ALLOWED, BLOCKED, HUMAN_REVIEW
    reason = Column(Text, nullable=False)
    rule_applied = Column(String(64), nullable=False)
    is_idempotent = Column(Boolean, default=True)
    idempotency_key = Column(String(128), index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("PaymentEventModel", back_populates="policy_decision")


class RecoveryActionModel(Base):
    __tablename__ = "recovery_actions"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payment_events.id"), unique=True, nullable=False)
    strategy_executed = Column(String(64), nullable=False)
    idempotency_key = Column(String(128), unique=True, index=True, nullable=False)
    action_status = Column(String(32), default="EXECUTED")  # EXECUTED, BLOCKED, PENDING_REVIEW
    executed_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("PaymentEventModel", back_populates="recovery_action")


class OutcomeModel(Base):
    __tablename__ = "recovery_outcomes"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payment_events.id"), unique=True, nullable=False)
    action_succeeded = Column(Boolean, nullable=False)
    revenue_recovered = Column(Float, default=0.0)
    time_to_recovery_hours = Column(Float, default=0.0)
    attempts_made = Column(Integer, default=1)
    intervention_cost = Column(Float, default=10.0)  # Estimated SMS/API/notification cost
    net_recovery_value = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("PaymentEventModel", back_populates="outcome")


class HumanReviewModel(Base):
    __tablename__ = "human_reviews"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payment_events.id"), unique=True, nullable=False)
    status = Column(String(32), default="PENDING", index=True)  # PENDING, APPROVED, REJECTED, OVERRIDDEN
    flag_reason = Column(Text, nullable=False)
    ai_recommendation = Column(String(64))
    ai_confidence = Column(Float)
    human_decision = Column(String(64), nullable=True)  # Strategy selected if approved/overridden
    override_reason = Column(Text, nullable=True)
    reviewed_by = Column(String(64), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("PaymentEventModel", back_populates="human_review")


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payment_events.id"), index=True, nullable=False)
    event_type = Column(String(64), nullable=False)  # PREDICTION, DIAGNOSIS, POLICY_CHECK, EXECUTION, HUMAN_REVIEW
    actor = Column(String(32), default="SYSTEM")  # SYSTEM, LLM_AGENT, POLICY_ENGINE, HUMAN_OPERATOR
    summary = Column(Text, nullable=False)
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    payment = relationship("PaymentEventModel", back_populates="audit_logs")
