/*
 * API Client Service for RevenueOS Frontend.
 * Interacts with FastAPI backend endpoints.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "/api/v1" : "http://localhost:8000/api/v1");

async function fetchJSON(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Executive Overview & Recovery Metrics
  getMetrics: () => fetchJSON("/recovery/metrics"),
  
  // Baseline Comparison
  getBaselineComparison: () => fetchJSON("/recovery/baseline-comparison"),
  
  // Strategy Optimization Matrix
  getStrategies: () => fetchJSON("/recovery/strategies"),
  
  // Revenue at Risk Exposure
  getRevenueAtRisk: () => fetchJSON("/revenue-at-risk"),
  
  // Transactions List & Explorer
  getTransactions: (skip = 0, limit = 50, status = "ALL", search = "") => 
    fetchJSON(`/transactions?skip=${skip}&limit=${limit}&status=${status}&search=${encodeURIComponent(search)}`),
    
  getTransactionDetail: (id: number) => fetchJSON(`/transactions/${id}`),
  
  // Single Transaction Execution Workflow
  analyzePayment: (id: number) => fetchJSON(`/recovery/analyze/${id}`, { method: "POST" }),
  decidePayment: (id: number) => fetchJSON(`/recovery/decide/${id}`, { method: "POST" }),
  executePayment: (id: number) => fetchJSON(`/recovery/execute/${id}`, { method: "POST" }),
  
  // Human Review Queue
  getHumanReviews: () => fetchJSON("/human-review"),
  submitHumanReviewDecision: (id: number, decision: string, humanStrategy?: string, reason = "") =>
    fetchJSON(`/human-review/${id}/decide`, {
      method: "POST",
      body: JSON.stringify({ decision, human_strategy: humanStrategy, reason })
    }),
    
  // Audit Trail Logs
  getAuditLogs: (limit = 100) => fetchJSON(`/audit?limit=${limit}`),
  
  // ML Model Metrics
  getModelMetrics: () => fetchJSON("/model/metrics"),
  
  // Demo Mode 1-Click Reset & Run Trigger
  resetAndRunDemo: () => fetchJSON("/demo/reset-and-run", { method: "POST" }),
  
  // Test Failure Scenario Trigger
  triggerFailureScenario: (scenarioId: string) => 
    fetchJSON(`/simulation/failure-scenario?scenario_id=${scenarioId}`, { method: "POST" })
};
