# RevenueOS — Evaluation & Methodology

## 1. Machine Learning Held-Out Evaluation

The recoverability prediction model was trained using Gradient Boosting on 8,000 samples and evaluated on a held-out test split of 2,000 transactions (80/20 train/test split).

### Held-Out Test Performance
- **Accuracy**: `93.75%`
- **Precision**: `95.17%`
- **Recall**: `94.11%`
- **F1 Score**: `94.64%`
- **ROC-AUC**: `99.06%`

```
Confusion Matrix (Held-Out Test):
┌────────────────┬──────────────────┬──────────────────┐
│                │ Predicted Fail 0 │ Predicted Pass 1 │
├────────────────┼──────────────────┼──────────────────┤
│ Actual Fail 0  │      772 (TN)    │       56 (FP)    │
│ Actual Pass 1  │       69 (FN)    │     1103 (TP)    │
└────────────────┴──────────────────┴──────────────────┘
```

## 2. Business Performance Evaluation

Side-by-side comparative simulation on 10,000 payment failure events:

| Metric | Conventional Fixed Retry | RevenueOS AI Engine | Net Improvement |
| :--- | :---: | :---: | :---: |
| **Total Revenue Recovered** | ₹5,11,676 | ₹1,22,27,562 | **+₹1.17 Crore (+2,289% Lift)** |
| **Overall Recovery Rate** | 2.64% | 79.36% | **+76.72%** |
| **Total Attempts Made** | 21,230 | 8,350 | **-60.67% Attempt Reduction** |
| **Wasted Retries** | 20,702 | 0 | **100% Elimination of Blind Retries** |
