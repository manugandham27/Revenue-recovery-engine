# RevenueOS — API Documentation

Interactive Swagger documentation is available at `http://localhost:8000/docs`.

## Core REST Endpoints

### 1. Ingestion & Search
- `POST /api/v1/payments/events`: Ingest a single payment failure event.
- `GET /api/v1/transactions`: Search and filter ingested payment transactions.
- `GET /api/v1/transactions/{id}`: Fetch detailed visual decision timeline for transaction.

### 2. Intelligent Recovery Pipeline
- `POST /api/v1/recovery/analyze/{id}`: Run ML recoverability prediction & LLM diagnosis.
- `POST /api/v1/recovery/decide/{id}`: Run Policy Engine evaluation and explainable rule checks.
- `POST /api/v1/recovery/execute/{id}`: Execute simulated recovery action.
- `POST /api/v1/recovery/batch-process`: Batch process unanalyzed events.

### 3. Analytics & Benchmarking
- `GET /api/v1/recovery/metrics`: High-level executive dashboard metrics.
- `GET /api/v1/recovery/baseline-comparison`: Baseline conventional retry vs RevenueOS comparative results.
- `GET /api/v1/recovery/strategies`: Strategy optimization matrix.
- `GET /api/v1/revenue-at-risk`: Exposure breakdown by risk tier & prioritized queue.

### 4. Human-in-the-Loop & Audit
- `GET /api/v1/human-review`: List escalated cases requiring operator review.
- `POST /api/v1/human-review/{id}/decide`: Submit operator approval, rejection, or override.
- `GET /api/v1/audit`: Query comprehensive decision audit logs.

### 5. Buildathon Demo Controls
- `POST /api/v1/demo/reset-and-run`: Reset database, seed 10,000 transactions, and run demo walkthrough cases.
- `POST /api/v1/simulation/failure-scenario`: Trigger controlled test failure scenarios (LLM outage, duplicate idempotency block, max retries limit).
