/*
 * API Client Service for RevenueOS Frontend.
 * Interacts with FastAPI backend endpoints with instant fallback to self-contained demo data.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// Standard Mock Datasets for instant demo
export const MOCK_METRICS = {
  total_payment_attempts: 10000,
  failed_payments: 10000,
  total_revenue_at_risk: 30534484.17,
  total_revenue_recovered: 12227562.84,
  incremental_revenue_recovered: 11715886.38,
  recovery_rate: 0.7936,
  recovery_improvement_percentage: 2289.71,
  avg_recovery_time_hours: 6.5,
  pending_human_reviews: 24,
  policy_blocks: 1650,
  idempotency_blocks_prevented: 261
};

export const MOCK_BASELINE = {
  total_payment_events: 10000,
  total_revenue_at_risk: 30534484.17,
  baseline: {
    system_name: "Conventional Fixed Retry",
    recovery_rate: 0.0264,
    revenue_recovered: 511676.46,
    total_attempts_made: 21230,
    avg_attempts_per_event: 2.12,
    unnecessary_retries_wasted: 20702
  },
  revenue_os: {
    system_name: "RevenueOS AI Recovery Engine",
    recovery_rate: 0.7936,
    revenue_recovered: 12227562.84,
    total_attempts_made: 8350,
    avg_attempts_per_event: 0.83,
    policy_blocks: 1650,
    human_reviews: 427
  },
  impact: {
    incremental_revenue_recovered: 11715886.38,
    improvement_percentage: 2289.71,
    retry_reduction_percentage: 60.67,
    unnecessary_retry_reduction: 12352
  }
};

export const MOCK_MODEL_METRICS = {
  model_name: "GradientBoostingClassifier",
  version: "1.0.0",
  evaluation_dataset: "Held-Out 20% Test Split (2,000 transactions)",
  metrics: {
    accuracy: 0.9375,
    precision: 0.9517,
    recall: 0.9411,
    f1: 0.9464,
    roc_auc: 0.9906,
    confusion_matrix: [[772, 56], [69, 1103]]
  },
  top_features: [
    { feature: "failure_type_insufficient_funds", importance: 0.3934 },
    { feature: "failure_type_expired_card", importance: 0.2094 },
    { feature: "failure_type_customer_action_required", importance: 0.0789 },
    { feature: "retry_count", importance: 0.0605 },
    { feature: "customer_historical_success_rate", importance: 0.0450 }
  ]
};

export const MOCK_TRANSACTIONS = Array.from({ length: 40 }).map((_, i) => {
  const methods = ["credit_card", "debit_card", "upi", "net_banking"];
  const failures = [
    { type: "temporary_network_failure", reason: "Temporary gateway network timeout", strat: "delayed_retry" },
    { type: "expired_card", reason: "Card instrument has expired", strat: "alternate_payment_method" },
    { type: "authentication_failure", reason: "3DS OTP verification failed or timed out", strat: "customer_notification" },
    { type: "insufficient_funds", reason: "Insufficient account balance", strat: "payment_link" },
    { type: "bank_decline", reason: "Issuer bank risk rule decline", strat: "delayed_retry" },
    { type: "customer_action_required", reason: "Mandate approval pending", strat: "mandate_retry" }
  ];
  const f = failures[i % failures.length];
  const proba = Math.round((0.35 + (i * 0.015) % 0.6) * 100) / 100;
  const amount = Math.round((1250 + (i * 2450) % 65000));
  const statuses = ["EXECUTED", "EXECUTED", "BLOCKED", "HUMAN_REVIEW", "EXECUTED"];
  const status = statuses[i % statuses.length];

  return {
    id: i + 1,
    transaction_id: `TXN_${(100000 + i * 37).toString(16).toUpperCase()}`,
    customer_id: `CUST_${1000 + i}`,
    merchant_id: `MERCH_${100 + (i % 5)}`,
    amount,
    currency: "INR",
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    payment_method: methods[i % methods.length],
    failure_type: f.type,
    failure_reason: f.reason,
    retry_count: i % 3,
    status,
    customer_historical_success_rate: 0.78,
    previous_success_rate: 0.82,
    device_type: "mobile",
    device_os: "Android",
    country: "IN",
    recoverability_probability: proba,
    expected_recovery_value: Math.round(amount * proba),
    recommended_strategy: f.strat,
    policy_decision: status === "BLOCKED" ? "BLOCKED" : (status === "HUMAN_REVIEW" ? "HUMAN_REVIEW" : "ALLOWED"),
    policy_reason: status === "BLOCKED" ? "Retry limit exceeded (>=3)" : (status === "HUMAN_REVIEW" ? "High value transaction requires human review" : "All policy checks passed"),
    revenue_recovered: status === "EXECUTED" ? amount : 0,
    action_succeeded: status === "EXECUTED"
  };
});

export const MOCK_REVENUE_AT_RISK = {
  total_revenue_at_risk: 30534484.17,
  high_probability_exposure: 15267242.08,
  medium_probability_exposure: 9160345.25,
  low_probability_exposure: 6106896.84,
  top_opportunities: MOCK_TRANSACTIONS.map(t => ({
    id: t.id,
    transaction_id: t.transaction_id,
    customer_id: t.customer_id,
    amount: t.amount,
    failure_type: t.failure_type,
    recoverability_probability: t.recoverability_probability,
    expected_recovery_value: t.expected_recovery_value,
    recommended_strategy: t.recommended_strategy
  })).sort((a, b) => b.expected_recovery_value - a.expected_recovery_value)
};

export const MOCK_STRATEGIES = {
  simulation_mode: "Empirical Simulation-Based Comparison",
  failure_matrix: {
    temporary_network_failure: {
      failure_type: "temporary_network_failure",
      failure_type_label: "Temporary Network Failure",
      total_events: 1800,
      best_strategy: "delayed_retry",
      best_strategy_label: "Delayed Retry (24h Window)",
      best_recovery_rate: 0.68,
      strategies_evaluated: [
        { strategy: "delayed_retry", strategy_label: "Delayed Retry", recovery_rate: 0.68, revenue_recovered: 2450000, intervention_cost: 2.0, sample_size: 600 },
        { strategy: "alternate_payment_method", strategy_label: "Alternate Payment Method", recovery_rate: 0.52, revenue_recovered: 1850000, intervention_cost: 5.0, sample_size: 400 },
        { strategy: "immediate_retry", strategy_label: "Immediate Retry", recovery_rate: 0.45, revenue_recovered: 1600000, intervention_cost: 1.0, sample_size: 400 }
      ]
    },
    expired_card: {
      failure_type: "expired_card",
      failure_type_label: "Expired Card Instrument",
      total_events: 800,
      best_strategy: "alternate_payment_method",
      best_strategy_label: "Alternate Payment Method Fallback",
      best_recovery_rate: 0.72,
      strategies_evaluated: [
        { strategy: "alternate_payment_method", strategy_label: "Alternate Payment Method", recovery_rate: 0.72, revenue_recovered: 1980000, intervention_cost: 4.0, sample_size: 400 },
        { strategy: "payment_link", strategy_label: "Payment Link via WhatsApp/SMS", recovery_rate: 0.65, revenue_recovered: 1750000, intervention_cost: 5.0, sample_size: 250 },
        { strategy: "immediate_retry", strategy_label: "Immediate Retry", recovery_rate: 0.00, revenue_recovered: 0, intervention_cost: 1.0, sample_size: 150 }
      ]
    },
    authentication_failure: {
      failure_type: "authentication_failure",
      failure_type_label: "3DS / OTP Timeout",
      total_events: 1500,
      best_strategy: "customer_notification",
      best_strategy_label: "Customer WhatsApp/SMS Prompt",
      best_recovery_rate: 0.62,
      strategies_evaluated: [
        { strategy: "customer_notification", strategy_label: "Customer Notification", recovery_rate: 0.62, revenue_recovered: 2150000, intervention_cost: 3.0, sample_size: 500 },
        { strategy: "payment_link", strategy_label: "Direct Payment Link", recovery_rate: 0.58, revenue_recovered: 1980000, intervention_cost: 5.0, sample_size: 500 }
      ]
    },
    insufficient_funds: {
      failure_type: "insufficient_funds",
      failure_type_label: "Insufficient Account Balance",
      total_events: 2200,
      best_strategy: "delayed_retry",
      best_strategy_label: "Salary-Cycle Delayed Retry",
      best_recovery_rate: 0.48,
      strategies_evaluated: [
        { strategy: "delayed_retry", strategy_label: "Salary-Cycle Delayed Retry", recovery_rate: 0.48, revenue_recovered: 3100000, intervention_cost: 2.0, sample_size: 800 },
        { strategy: "payment_link", strategy_label: "Payment Link", recovery_rate: 0.42, revenue_recovered: 2700000, intervention_cost: 5.0, sample_size: 700 }
      ]
    }
  }
};

export const MOCK_HUMAN_REVIEWS = MOCK_TRANSACTIONS.filter(t => t.status === "HUMAN_REVIEW" || t.amount > 30000).slice(0, 10).map((t, idx) => ({
  review_id: idx + 1,
  payment_id: t.id,
  transaction_id: t.transaction_id,
  customer_id: t.customer_id,
  amount: t.amount,
  failure_type: t.failure_type,
  flag_reason: t.amount > 50000 ? "High value transaction exceeds auto-threshold (₹50,000)" : "Low AI diagnosis confidence (52%)",
  ai_recommendation: t.recommended_strategy,
  ai_confidence: 0.58,
  status: "PENDING",
  human_decision: null,
  override_reason: null,
  reviewed_by: null,
  created_at: t.timestamp
}));

export const MOCK_AUDIT_LOGS = MOCK_TRANSACTIONS.slice(0, 15).flatMap(t => [
  { id: t.id * 4 - 3, payment_id: t.id, transaction_id: t.transaction_id, event_type: "INGESTION", actor: "SYSTEM", summary: `Ingested payment failure event ${t.transaction_id}`, timestamp: t.timestamp },
  { id: t.id * 4 - 2, payment_id: t.id, transaction_id: t.transaction_id, event_type: "ANALYSIS", actor: "ML_MODEL & LLM_DIAGNOSIS", summary: `Predicted recoverability ${(t.recoverability_probability * 100).toFixed(0)}% (Expected ₹${t.expected_recovery_value}). Diagnosed cause: '${t.failure_type}'`, timestamp: t.timestamp },
  { id: t.id * 4 - 1, payment_id: t.id, transaction_id: t.transaction_id, event_type: "POLICY_CHECK", actor: "POLICY_ENGINE", summary: `Policy decision: ${t.policy_decision}. Reason: ${t.policy_reason}`, timestamp: t.timestamp },
  { id: t.id * 4, payment_id: t.id, transaction_id: t.transaction_id, event_type: "EXECUTION", actor: "SIMULATION_ENGINE", summary: `Executed strategy '${t.recommended_strategy}'. Outcome: ${t.status === "EXECUTED" ? "SUCCESS" : "BLOCKED"}`, timestamp: t.timestamp }
]);

async function fetchJSON(endpoint: string, fallbackData: any, options?: RequestInit) {
  if (!API_BASE) {
    return fallbackData;
  }
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      return fallbackData;
    }
    const data = await res.json();
    return data || fallbackData;
  } catch (err: any) {
    return fallbackData;
  }
}

export const api = {
  getMetrics: () => fetchJSON("/recovery/metrics", MOCK_METRICS),
  getBaselineComparison: () => fetchJSON("/recovery/baseline-comparison", MOCK_BASELINE),
  getStrategies: () => fetchJSON("/recovery/strategies", MOCK_STRATEGIES),
  getRevenueAtRisk: () => fetchJSON("/revenue-at-risk", MOCK_REVENUE_AT_RISK),
  
  getTransactions: (skip = 0, limit = 50, status = "ALL", search = "") => {
    let items = MOCK_TRANSACTIONS;
    if (status && status !== "ALL") items = items.filter(t => t.status === status);
    if (search) items = items.filter(t => t.transaction_id.includes(search) || t.customer_id.includes(search));
    const fallback = {
      total: items.length,
      items: items.slice(skip, skip + limit)
    };
    return fetchJSON(`/transactions?skip=${skip}&limit=${limit}&status=${status}&search=${encodeURIComponent(search)}`, fallback);
  },
  
  getTransactionDetail: (id: number) => {
    const t = MOCK_TRANSACTIONS.find(item => item.id === id) || MOCK_TRANSACTIONS[0];
    const detailFallback = {
      event: t,
      prediction: { recoverability_probability: t.recoverability_probability, expected_recovery_value: t.expected_recovery_value, confidence: 0.91, risk_tier: t.recoverability_probability > 0.7 ? "HIGH" : "MEDIUM" },
      diagnosis: { root_cause: t.failure_type, reasoning_summary: t.failure_reason, recommended_strategy: t.recommended_strategy, confidence: 0.88, provider_used: "MOCK_FALLBACK" },
      policy_decision: { decision: t.policy_decision, reason: t.policy_reason, rule_applied: "POLICY_CHECK", recommended_strategy: t.recommended_strategy, idempotency_key: `${t.transaction_id}:${t.recommended_strategy}` },
      outcome: t.status === "EXECUTED" ? { action_succeeded: true, revenue_recovered: t.amount, time_to_recovery_hours: 4.5, attempts_made: t.retry_count + 1, intervention_cost: 5.0, net_recovery_value: t.amount - 5.0 } : null,
      human_review: t.status === "HUMAN_REVIEW" ? { status: "PENDING", flag_reason: t.policy_reason, ai_recommendation: t.recommended_strategy, ai_confidence: 0.58 } : null,
      audit_logs: MOCK_AUDIT_LOGS.filter(l => l.payment_id === id)
    };
    return fetchJSON(`/transactions/${id}`, detailFallback);
  },
  
  analyzePayment: (id: number) => fetchJSON(`/recovery/analyze/${id}`, { status: "success" }, { method: "POST" }),
  decidePayment: (id: number) => fetchJSON(`/recovery/decide/${id}`, { status: "success" }, { method: "POST" }),
  executePayment: (id: number) => fetchJSON(`/recovery/execute/${id}`, { status: "success" }, { method: "POST" }),
  
  getHumanReviews: () => fetchJSON("/human-review", MOCK_HUMAN_REVIEWS),
  submitHumanReviewDecision: (id: number, decision: string, humanStrategy?: string, reason = "") =>
    fetchJSON(`/human-review/${id}/decide`, { status: "success", decision }, {
      method: "POST",
      body: JSON.stringify({ decision, human_strategy: humanStrategy, reason })
    }),
    
  getAuditLogs: (limit = 100) => fetchJSON(`/audit?limit=${limit}`, MOCK_AUDIT_LOGS),
  getModelMetrics: () => fetchJSON("/model/metrics", MOCK_MODEL_METRICS),
  
  resetAndRunDemo: () => fetchJSON("/demo/reset-and-run", { status: "success", message: "Demo environment reset and initialized successfully with 10,000 synthetic records.", processed_events: 150 }, { method: "POST" }),
  
  triggerFailureScenario: (scenarioId: string) => {
    let mockScenario = {};
    if (scenarioId === "SCENARIO_1") {
      mockScenario = { scenario: "LLM Provider Outage", status: "GRACEFUL_FALLBACK", diagnosis_result: { root_cause: "bank_decline", reasoning_summary: "Fallback to deterministic diagnosis.", recommended_strategy: "delayed_retry", confidence: 0.80, provider_used: "MOCK_FALLBACK" } };
    } else if (scenarioId === "SCENARIO_3") {
      mockScenario = { scenario: "Duplicate Action Ingestion", result: { decision: "BLOCKED", reason: "Idempotency protection block: Strategy 'delayed_retry' already executed.", rule_applied: "IDEMPOTENCY_PROTECTION" } };
    } else {
      mockScenario = { scenario: "Max Retries Exceeded", result: { decision: "BLOCKED", reason: "Maximum retry limit reached (3 retries attempted). Allowed limit: MAX_RETRIES = 3.", rule_applied: "MAX_RETRIES_EXCEEDED" } };
    }
    return fetchJSON(`/simulation/failure-scenario?scenario_id=${scenarioId}`, mockScenario, { method: "POST" });
  }
};
