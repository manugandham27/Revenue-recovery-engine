"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  ArrowUpRight, 
  Zap, 
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { api } from "@/lib/api";

export default function RevenueAtRiskView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    setLoading(true);
    try {
      const res = await api.getRevenueAtRisk();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number = 0) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-400 text-xs">Loading Revenue at Risk analysis...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Exposure Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Total Exposure at Risk</span>
          <p className="text-2xl font-bold text-white mt-2">
            {formatCurrency(data?.total_revenue_at_risk)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Cumulative payment failures</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 glow-emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400">Highly Recoverable Tier</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">&gt;70% Score</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {formatCurrency(data?.high_probability_exposure)}
          </p>
          <span className="text-[10px] text-emerald-300/80 mt-1 block">Immediate execution priority</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400">Medium Recoverability Tier</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">40-70% Score</span>
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {formatCurrency(data?.medium_probability_exposure)}
          </p>
          <span className="text-[10px] text-amber-300/80 mt-1 block">Policy-bounded retries</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-400">Low Recoverability Tier</span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">&lt;40% Score</span>
          </div>
          <p className="text-2xl font-bold text-rose-400 mt-2">
            {formatCurrency(data?.low_probability_exposure)}
          </p>
          <span className="text-[10px] text-rose-300/80 mt-1 block">Requires manual / no-action</span>
        </div>

      </div>

      {/* Prioritized Opportunity Queue Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Prioritized High-Value Recovery Queue</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked strictly by <span className="text-emerald-400 font-semibold">Expected Recovery Value (Amount × Probability)</span> for optimal ROI
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
            Highest ROI First
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Failure Reason</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Recoverability Score</th>
                <th className="px-4 py-3">Expected Value (ROI)</th>
                <th className="px-4 py-3 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data?.top_opportunities?.slice(0, 20).map((item: any, idx: number) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-400">#{idx + 1}</td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-white">{item.transaction_id}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-400">{item.customer_id}</td>
                  <td className="px-4 py-3.5 text-slate-300 font-medium">{item.failure_type}</td>
                  <td className="px-4 py-3.5 font-semibold text-white">₹{item.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-14 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${item.recoverability_probability * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {(item.recoverability_probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-400 text-sm">
                    ₹{item.expected_recovery_value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-medium text-blue-400">
                    {item.recommended_strategy?.replace(/_/g, " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
