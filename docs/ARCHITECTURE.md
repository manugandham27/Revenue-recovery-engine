# RevenueOS — Architecture Documentation

RevenueOS is an enterprise-grade AI revenue recovery and optimization system designed for Razorpay payment infrastructure.

## System Architecture Overview

```
[ Ingested Payment Failure Stream (10,000+ synthetic events) ]
                             │
                             ▼
 ┌─────────────────────────────────────────────────────────┐
 │                   FastAPI Backend App                   │
 ├─────────────────────────────────────────────────────────┤
 │ 1. ML Recoverability Engine (GradientBoosting, 99% AUC)│
 │ 2. AI Semantic Diagnosis Layer (LLM with Fallback)      │
 │ 3. Deterministic Policy Bounds Engine                   │
 │ 4. Simulated Recovery Action & Outcome Execution        │
 │ 5. Strategy Optimizer & Baseline Comparator             │
 └───────────────────────────┬─────────────────────────────┘
                             │
                             ▼
 ┌─────────────────────────────────────────────────────────┐
 │              Next.js Fintech Ops Dashboard              │
 ├─────────────────────────────────────────────────────────┤
 │ • Executive Revenue & Baseline Lift Overview            │
 │ • Searchable Transaction Explorer & Decision Timeline   │
 │ • Revenue-at-Risk Prioritized Opportunity Queue         │
 │ • Strategy Optimization Matrix per Failure Category     │
 │ • Human-in-the-Loop Oversight Queue                     │
 │ • Immutable Compliance Audit Trail Inspector            │
 └─────────────────────────────────────────────────────────┘
```

## Modular Responsibilities

1. **Machine Learning Model (`ml/`)**: Predicts numerical recoverability probability `p ∈ [0,1]` and expected recovery value `₹ (Amount × p)`. Holds 93.75% accuracy and 99.06% ROC-AUC on held-out evaluation set.
2. **AI Diagnosis Layer (`backend/app/core/llm_service.py`)**: Analyzes failure reason context and recommends recovery strategy. Features non-blocking deterministic fallback when API keys are absent.
3. **Deterministic Policy Engine (`backend/app/core/policy_engine.py`)**: Enforces safety constraints: MAX_RETRIES (3), High Value Threshold (>₹50,000), Confidence Threshold (<60%), Negative ROI, and Idempotency locks.
4. **Strategy Experimentation Engine (`backend/app/core/experimentation.py`)**: Benchmarks recovery strategies across failure categories to build empirical optimal intervention matrices.
5. **Baseline Comparison Engine (`backend/app/core/baseline.py`)**: Compares conventional fixed retries vs RevenueOS AI engine.
