"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShieldAlert, 
  UserCheck, 
  MessageSquare,
  Clock
} from "lucide-react";
import { api, MOCK_HUMAN_REVIEWS } from "@/lib/api";

export default function HumanReviewQueue() {
  const [cases, setCases] = useState<any[]>(MOCK_HUMAN_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [actionDecision, setActionDecision] = useState<string>("APPROVED");
  const [overrideStrategy, setOverrideStrategy] = useState<string>("alternate_payment_method");
  const [reasonNote, setReasonNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const res = await api.getHumanReviews();
      if (res && res.length) {
        setCases(res);
      }
    } catch (err) {
      console.error(err);
      setCases(MOCK_HUMAN_REVIEWS);
    }
  };

  const handleSubmitDecision = async () => {
    if (!selectedCase) return;
    setSubmitting(true);
    try {
      await api.submitHumanReviewDecision(
        selectedCase.review_id,
        actionDecision,
        actionDecision === "OVERRIDDEN" ? overrideStrategy : selectedCase.ai_recommendation,
        reasonNote || "Human reviewer approval"
      );
      // Locally update state for instant UI update
      setCases(prev => prev.map(c => c.review_id === selectedCase.review_id ? {
        ...c,
        status: actionDecision,
        human_decision: actionDecision === "OVERRIDDEN" ? overrideStrategy : selectedCase.ai_recommendation,
        override_reason: reasonNote || "Human reviewer action",
        reviewed_by: "Fintech Ops Lead"
      } : c));
      setSelectedCase(null);
      setReasonNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number = 0) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const displayCases = cases.length ? cases : MOCK_HUMAN_REVIEWS;
  const pendingCases = displayCases.filter(c => c.status === "PENDING");
  const resolvedCases = displayCases.filter(c => c.status !== "PENDING");

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <span>Human-in-the-Loop Oversight Queue</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review escalated high-value, low-confidence, or policy-flagged recovery interventions.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold">
            {pendingCases.length} Pending Review
          </span>
        </div>
      </div>

      {/* Pending Cases Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight">Pending Escalated Cases</h3>
        
        {pendingCases.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
            🎉 No pending human review cases. All transactions cleared policy safety bounds.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingCases.map((c) => (
              <div key={c.review_id} className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/5 space-y-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-white">{c.transaction_id}</span>
                    <p className="text-[10px] text-slate-400">Customer: {c.customer_id}</p>
                  </div>
                  <span className="text-lg font-extrabold text-amber-400 font-mono">{formatCurrency(c.amount)}</span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="text-slate-400">
                    Flag Reason: <span className="text-amber-300 font-medium">{c.flag_reason}</span>
                  </div>
                  <div className="text-slate-400">
                    AI Recommendation: <span className="text-blue-400 font-semibold">{c.ai_recommendation?.replace(/_/g, " ")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-500">{c.created_at}</span>
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Take Review Action
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved History */}
      {resolvedCases.length > 0 && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight">Resolved Operator Review Audit History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Operator Decision</th>
                  <th className="px-4 py-3">Executed Strategy</th>
                  <th className="px-4 py-3">Reviewer Note</th>
                  <th className="px-4 py-3">Reviewed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {resolvedCases.map((c) => (
                  <tr key={c.review_id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-medium text-white">{c.transaction_id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatCurrency(c.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-purple-500/10 text-purple-400"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blue-400 font-medium">{c.human_decision?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-slate-400 italic">"{c.override_reason}"</td>
                    <td className="px-4 py-3 text-slate-300 font-medium">{c.reviewed_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Operator Action Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Review Case: {selectedCase.transaction_id}</h3>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-300"><span className="text-slate-400">Transaction Amount:</span> <span className="text-white font-bold">{formatCurrency(selectedCase.amount)}</span></p>
              <p className="text-slate-300"><span className="text-slate-400">Flag Reason:</span> <span className="text-amber-300 font-medium">{selectedCase.flag_reason}</span></p>
              <p className="text-slate-300"><span className="text-slate-400">AI Recommendation:</span> <span className="text-blue-400 font-semibold">{selectedCase.ai_recommendation?.replace(/_/g, " ")}</span></p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Select Operator Action:</label>
              <div className="grid grid-cols-3 gap-2">
                {["APPROVED", "OVERRIDDEN", "REJECTED"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setActionDecision(d)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      actionDecision === d
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {actionDecision === "OVERRIDDEN" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Override with Custom Strategy:</label>
                <select
                  value={overrideStrategy}
                  onChange={(e) => setOverrideStrategy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="alternate_payment_method">Alternate Payment Method</option>
                  <option value="payment_link">Payment Link via WhatsApp/SMS</option>
                  <option value="delayed_retry">Delayed Retry (24h Window)</option>
                  <option value="mandate_retry">Mandate Re-authorization</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Reviewer Audit Note:</label>
              <textarea
                placeholder="Enter justification for operator decision..."
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Logging..." : "Confirm Decision"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
