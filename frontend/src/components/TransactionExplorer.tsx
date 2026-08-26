"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  BrainCircuit, 
  Clock, 
  Zap, 
  FileText,
  X,
  ChevronLeft
} from "lucide-react";
import { api, MOCK_TRANSACTIONS } from "@/lib/api";

interface TransactionExplorerProps {
  transactions: any[];
  total: number;
  onRefresh: () => void;
}

export default function TransactionExplorer({
  transactions,
  total,
  onRefresh
}: TransactionExplorerProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const pageSize = 15;
  const listData = (transactions && transactions.length > 0) ? transactions : MOCK_TRANSACTIONS;

  const formatCurrency = (amount: number = 0) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleOpenDetail = async (txn: any) => {
    setSelectedTxn(txn);
    setLoadingDetail(true);
    try {
      const data = await api.getTransactionDetail(txn.id);
      setDetailData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "EXECUTED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">RECOVERED</span>;
      case "BLOCKED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">POLICY BLOCKED</span>;
      case "HUMAN_REVIEW":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">HUMAN REVIEW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">{status}</span>;
    }
  };

  const filtered = listData.filter(t => {
    const matchesSearch = !search || 
      t.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_id.toLowerCase().includes(search.toLowerCase()) ||
      t.failure_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search across 500+ transactions by ID, Customer, or Failure..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses ({listData.length})</option>
              <option value="EXECUTED">Recovered</option>
              <option value="BLOCKED">Policy Blocked</option>
              <option value="HUMAN_REVIEW">Human Review</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Failure Reason</th>
                <th className="px-5 py-3.5">Recoverability</th>
                <th className="px-5 py-3.5">AI Recommended Action</th>
                <th className="px-5 py-3.5">Policy Result</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedItems.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="px-5 py-4 font-mono font-medium text-white">
                    {t.transaction_id}
                    <div className="text-[10px] text-slate-400 font-sans">{t.customer_id}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-white">
                    {formatCurrency(t.amount)}
                    <div className="text-[10px] text-slate-400 font-normal uppercase">{t.payment_method}</div>
                  </td>
                  <td className="px-5 py-4 max-w-xs truncate">
                    <span className="font-medium text-slate-200">{t.failure_type}</span>
                    <p className="text-[10px] text-slate-400 truncate">{t.failure_reason}</p>
                  </td>
                  <td className="px-5 py-4">
                    {t.recoverability_probability !== null ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              t.recoverability_probability >= 0.7
                                ? "bg-emerald-500"
                                : t.recoverability_probability >= 0.4
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${t.recoverability_probability * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-white">
                          {(t.recoverability_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-blue-400">
                      {t.recommended_strategy ? t.recommended_strategy.replace(/_/g, " ") : "delayed retry"}
                    </span>
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(t.status)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(t)}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg font-medium transition-all inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} transactions</span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>
            
            <span className="font-mono text-white font-semibold">Page {currentPage} of {totalPages}</span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Decision Timeline Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-white font-mono">{selectedTxn.transaction_id}</h3>
                  {getStatusBadge(selectedTxn.status)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Amount: <span className="text-white font-semibold">{formatCurrency(selectedTxn.amount)}</span> | Customer: {selectedTxn.customer_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center text-slate-400 text-xs">Loading decision timeline...</div>
            ) : detailData ? (
              <div className="space-y-6">
                
                {/* Visual Step-by-Step Decision Timeline */}
                <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                  
                  {/* Step 1: Payment Failed Ingestion */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 text-xs font-bold">
                      1
                    </div>
                    <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Payment Failure Event Ingested</span>
                        <span className="text-[10px] text-slate-400">{detailData.event?.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-200 mt-2 font-medium">{detailData.event?.failure_reason}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Method: {detailData.event?.payment_method}</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Retries: {detailData.event?.retry_count}</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Historical Rate: {((detailData.event?.customer_historical_success_rate || 0.78) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: ML Recoverability Prediction */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 text-xs font-bold">
                      2
                    </div>
                    <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>ML Recoverability Prediction</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {((detailData.prediction?.recoverability_probability || 0.75) * 100).toFixed(1)}% Score
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2">
                        Expected Recovery Value: <span className="text-emerald-400 font-semibold">{formatCurrency(detailData.prediction?.expected_recovery_value)}</span> | Risk Tier: <span className="text-blue-400 font-semibold">{detailData.prediction?.risk_tier || "HIGH"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Step 3: AI Diagnosis Layer */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-400 text-xs font-bold">
                      3
                    </div>
                    <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Root Cause Diagnosis</span>
                        <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          Confidence: {((detailData.diagnosis?.confidence || 0.9) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 mt-2 font-medium">Root Cause: <span className="text-purple-300">{detailData.diagnosis?.root_cause}</span></p>
                      <p className="text-xs text-slate-400 mt-1 italic">"{detailData.diagnosis?.reasoning_summary}"</p>
                      <div className="mt-2 text-xs font-semibold text-blue-400">
                        Recommended Strategy: {detailData.diagnosis?.recommended_strategy?.replace(/_/g, " ")}
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Deterministic Policy Engine */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 text-xs font-bold">
                      4
                    </div>
                    <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Deterministic Policy Evaluation</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          detailData.policy_decision?.decision === "ALLOWED" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {detailData.policy_decision?.decision}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2">{detailData.policy_decision?.reason}</p>
                      <div className="mt-2 text-[10px] text-slate-400 font-mono">
                        Rule Applied: {detailData.policy_decision?.rule_applied} | Idempotency Key: {detailData.policy_decision?.idempotency_key}
                      </div>
                    </div>
                  </div>

                  {/* Step 5: Simulated Outcome */}
                  {detailData.outcome && (
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-xs font-bold">
                        5
                      </div>
                      <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Execution & Recovery Result</span>
                          </span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            +{formatCurrency(detailData.outcome.revenue_recovered)} Recovered
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2">
                          Time to Recovery: <span className="font-semibold text-white">{detailData.outcome.time_to_recovery_hours} hrs</span> | Attempts Made: {detailData.outcome.attempts_made}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ) : null}
            
          </div>
        </div>
      )}

    </div>
  );
}
