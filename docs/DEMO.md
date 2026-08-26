# RevenueOS — Demo Guide & Pitch Script

## Quick Start (Buildathon Judge Demo)

1. Start FastAPI Backend:
   ```bash
   PYTHONPATH=backend ./venv/bin/uvicorn app.main:app --reload --port 8000
   ```

2. Start Next.js Frontend:
   ```bash
   cd frontend && npm run dev
   ```

3. Open `http://localhost:3000` in browser.

4. Click **"Buildathon Demo Run"** in top navbar.
   - Database resets & ingests 10,000 synthetic transactions.
   - Batch processes predictions & policy evaluations.
   - Populates metrics & baseline comparison dashboard.

5. Click **"5-Min Pitch Mode"** to launch interactive judge walkthrough presentation.

## Pitch Narrative Outline (5 Minutes)

- **0:00–0:30 (Problem)**: Blind retries waste gateway fees and trigger fraud blocks.
- **0:30–1:00 (Solution)**: Decoupled ML recoverability prediction + LLM diagnosis + Policy safety bounds.
- **1:00–2:00 (Live Transaction)**: Visual decision timeline modal showing step-by-step reasoning.
- **2:00–3:00 (Business Impact)**: Baseline vs RevenueOS comparison (+2,289% revenue lift).
- **3:00–4:00 (Strategy Optimization)**: Failure category empirical strategy matrix.
- **4:00–5:00 (Production Reliability)**: Human review, policy bounds, idempotency locks, LLM outage fallback.
