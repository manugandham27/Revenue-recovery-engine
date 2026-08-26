# RevenueOS — AI Revenue Recovery & Optimization Engine

> **Razorpay AI Buildathon Submission — Track 03: AI Revenue Recovery**  
> *Production-Style Intelligent Revenue Recovery System for Payment Infrastructure*

---

## 1. Problem
When digital payments fail, payment gateways and merchants typically rely on fixed, blind retry rules (e.g., retrying every failed payment 3 times over 24 hours). This causes three severe problems:
- **Wasted Operational Costs**: Network retry fees incurred on unrecoverable failures (e.g., expired cards, invalid bank accounts).
- **Suboptimal Recovery Rates**: Retrying at wrong times or with wrong channels fails to recover payments that require user action (e.g., 3DS OTP timeout, mandate approval).
- **Poor Customer Experience**: Repeated failed charges trigger issuer bank fraud flags and alienate customers.

---

## 2. Why It Matters
Payment failures account for **5% to 15% of total merchant revenue leakage** annually. In high-volume fintech platforms processing billions in monthly volume, recovering even 10% of failed payments represents tens of millions of dollars in incremental bottom-line revenue.

---

## 3. Solution
**RevenueOS** is an intelligent revenue recovery engine that:
1. **Detects Revenue at Risk**: Identifies exposure tiers and expected recovery values.
2. **Predicts Recoverability**: Uses ML to calculate precision recoverability probabilities.
3. **Diagnoses Root Causes**: Leverages AI/LLM semantic analysis to determine why the payment failed.
4. **Selects Optimal Interventions**: Matches failure causes with high-ROI recovery strategies (e.g. WhatsApp payment links, UPI fallback, delayed salary-cycle retries).
5. **Enforces Deterministic Policy Bounds**: Guarantees safety, idempotency, and retry limits.
6. **Provides Full Auditability**: Logs every decision step for compliance.

---

## 4. Architecture
See full documentation in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```
[ Synthetic Payment Ingestion Stream (10,000 Events) ]
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │              FastAPI Backend App             │
  ├──────────────────────────────────────────────┤
  │ • ML Recoverability Predictor (GBDT)         │
  │ • AI Diagnosis Layer (LLM / Mock Fallback)   │
  │ • Safety Policy Engine (Deterministic Bounds)│
  │ • Recovery Simulation & Outcome Tracker      │
  │ • Strategy Experimentation Matrix            │
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │        Next.js Fintech Ops Dashboard         │
  ├──────────────────────────────────────────────┤
  │ • Executive Metrics & Baseline Lift Charts   │
  │ • Transaction Explorer & Decision Timeline   │
  │ • Revenue-at-Risk Prioritized Opportunity    │
  │ • Strategy Optimization Breakdown            │
  │ • Human-in-the-Loop Review Queue             │
  │ • Immutable Compliance Audit Trail           │
  └──────────────────────────────────────────────┘
```

---

## 5. AI Components
- **Recoverability Prediction Model**: Supervised Gradient Boosting Classifier estimating recovery probability `p ∈ [0, 1]`.
- **Semantic Diagnosis Layer**: LLM Service (OpenAI / Gemini / Mock Fallback) translating raw gateway error codes into root cause explanations and recommended strategies.

---

## 6. ML Model
- **Algorithm**: Gradient Boosting Classifier (scikit-learn).
- **Features**: Transaction amount, payment method, failure type, retry count, customer historical success rate, transaction hour, day of week, currency, device type, device OS, country.
- **Held-Out Evaluation Split**: 80/20 train/test split (8,000 train / 2,000 test).
- **Held-Out Metrics**:
  - Accuracy: `93.75%`
  - Precision: `95.17%`
  - Recall: `94.11%`
  - F1 Score: `94.64%`
  - ROC-AUC: `99.06%`

---

## 7. Policy Engine
A deterministic rule engine validating AI recommendations before any action can execute:
- `MAX_RETRIES`: Retry limit check (`retry_count >= 3` -> STOP).
- `HIGH_VALUE_THRESHOLD`: Transactions > ₹50,000 -> Escalate to `HUMAN_REVIEW`.
- `CONFIDENCE_THRESHOLD`: AI confidence < 0.60 -> Escalate to `HUMAN_REVIEW`.
- `NEGATIVE_ROI_CHECK`: Expected recovery value < intervention cost -> Block action.
- `IDEMPOTENCY_PROTECTION`: Prevents duplicate strategy execution on the same transaction key.

---

## 8. Revenue Recovery Workflow
1. **Ingestion**: Ingest payment failure event.
2. **Prediction**: ML model calculates recoverability probability and expected recovery value.
3. **Diagnosis**: AI layer provides semantic root cause and recommended strategy.
4. **Policy Check**: Deterministic engine validates rule bounds.
5. **Execution Simulation**: Bounded action executed and outcome recorded.
6. **Audit Logging**: Step appended to immutable compliance audit trail.

---

## 9. Experimentation Engine
Evaluates 7 recovery strategies across 8 failure categories to compute empirical strategy matrices:
- Recovery rate %
- Revenue recovered ₹
- Average attempts
- Intervention cost per recovery
- Empirical sample size

---

## 10. Dataset
Synthetically generated dataset (`data/synthetic_payments.csv`) containing **10,000 payment failure events** generated with seed `42` for exact reproducibility.

---

## 11. Evaluation Methodology
Distinguishes between:
- **ML Model Metrics**: Evaluated on held-out test split (2,000 transactions).
- **Business System Metrics**: Simulated performance on 10,000 events comparing RevenueOS against conventional fixed retries.

---

## 12. Baseline Comparison
| Metric | Conventional Fixed Retry | RevenueOS AI Engine | Impact |
| :--- | :---: | :---: | :---: |
| **Revenue Recovered** | ₹5,11,676 | ₹1,22,27,562 | **+₹1.17 Cr (+2,289% Lift)** |
| **Recovery Rate** | 2.64% | 79.36% | **+76.72%** |
| **Total Attempts** | 21,230 | 8,350 | **-60.67% Retry Reduction** |
| **Unnecessary Retries Wasted** | 20,702 | 0 | **100% Elimination** |

---

## 13. Results
RevenueOS achieves a **2,289% revenue recovery lift** over conventional retries while reducing total network retry attempts by **60.67%**.

---

## 14. Failure Handling
- **LLM Outage**: Seamlessly degrades to deterministic mock diagnosis without service interruption.
- **Duplicate Requests**: Idempotency key protection blocks double charge execution.
- **Low AI Confidence**: Automatically routes transaction to Human-in-the-Loop review.

---

## 15. Human-in-the-Loop
Dedicated review queue for escalated cases. Operators can approve, reject, or override AI strategy recommendations with audit reason logging.

---

## 16. Deployment
Multi-container configuration provided via Docker & Docker Compose (`docker-compose.yml`).

---

## 17. How to Run Locally

### Prerequisites
- Python 3.9+
- Node.js 18+

### Setup & Run
1. Install Python dependencies:
   ```bash
   python3 -m venv venv
   ./venv/bin/pip install -r requirements.txt
   ```
2. Generate synthetic data & train ML model:
   ```bash
   ./venv/bin/python data/scripts/generate_synthetic_data.py
   ./venv/bin/python ml/scripts/train_model.py
   ```
3. Run FastAPI Backend:
   ```bash
   PYTHONPATH=backend ./venv/bin/uvicorn app.main:app --reload --port 8000
   ```
4. Run Next.js Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

---

## 18. Demo Instructions
1. Open the dashboard at `http://localhost:3000`.
2. Click **"Buildathon Demo Run"** in top navbar to trigger end-to-end reset, seeding, and batch evaluation.
3. Click **"5-Min Pitch Mode"** to launch the interactive presentation.
4. Click any transaction in **Transaction Explorer** to inspect the 5-step visual decision timeline modal.

---

## 19. Limitations
- Dataset is synthetically generated to satisfy fintech privacy guidelines.
- Payment gateway interactions are executed in a simulated sandbox environment.

---

## 20. Future Work
- Real-time Kafka / Webhook event streaming integration.
- Production integration with Razorpay Webhook APIs.
- Reinforcement Learning (Multi-Armed Bandits) for dynamic strategy exploration.
