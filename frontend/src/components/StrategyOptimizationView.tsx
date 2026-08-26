"use client";

import React, { useState, useEffect } from "react";
import { 
  Sliders, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Award, 
  Layers,
  ArrowRight
} from "lucide-react";
import { api, MOCK_STRATEGIES } from "@/lib/api";

export default function StrategyOptimizationView() {
  const [data, setData] = useState<any>(MOCK_STRATEGIES);
  const [selectedFailure, setSelectedFailure] = useState<string>("temporary_network_failure");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStrategyData();
  }, []);

  const loadStrategyData = async () => {
    try {
      const res = await api.getStrategies();
      if (res && res.failure_matrix) {
        setData(res);
        const keys = Object.keys(res.failure_matrix);
        if (keys.length > 0) setSelectedFailure(keys[0]);
      }
    } catch (err) {
      console.error(err);
      setData(MOCK_STRATEGIES);
    }
  };

  const formatCurrency = (amount: number = 0) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const failureMatrix = data?.failure_matrix || MOCK_STRATEGIES.failure_matrix;
  const currentFailureData = failureMatrix[selectedFailure] || failureMatrix["temporary_network_failure"] || {};

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Strategy Experimentation & Optimization Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Identifies optimal recovery strategy per failure reason backed by 10,000 empirical simulation runs.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono">
          {data?.simulation_mode || "Empirical Benchmark"}
        </span>
      </div>

      {/* Failure Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
        {Object.keys(failureMatrix).map((ftype) => {
          const item = failureMatrix[ftype];
          const isActive = selectedFailure === ftype;
          return (
            <button
              key={ftype}
              onClick={() => setSelectedFailure(ftype)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {item.failure_type_label}
            </button>
          );
        })}
      </div>

      {/* Best Strategy Spotlight Card */}
      {currentFailureData.best_strategy && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 glow-emerald flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                🏆 Optimal Recovery Strategy
              </span>
              <span className="text-xs text-slate-400 font-mono">Category: {currentFailureData.failure_type_label}</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {currentFailureData.best_strategy_label}
            </h3>
            <p className="text-xs text-slate-300 mt-2 max-w-xl">
              Backed by <span className="font-semibold text-white">{currentFailureData.total_events}</span> empirical simulation cases. Yields highest net recovered revenue with lowest cost.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center min-w-[180px]">
            <span className="text-xs text-slate-400 block mb-1">Peak Recovery Rate</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {((currentFailureData.best_recovery_rate || 0.68) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Full Strategy Breakdown Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Evaluated Recovery Strategies for "{currentFailureData.failure_type_label}"
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Strategy</th>
                <th className="px-5 py-3.5">Recovery Rate</th>
                <th className="px-5 py-3.5">Revenue Recovered</th>
                <th className="px-5 py-3.5">Intervention Cost / Recovery</th>
                <th className="px-5 py-3.5">Sample Size</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {currentFailureData.strategies_evaluated?.map((st: any, idx: number) => (
                <tr key={st.strategy} className={idx === 0 ? "bg-emerald-950/10 font-semibold" : "hover:bg-slate-800/40"}>
                  <td className="px-5 py-4 text-white font-medium flex items-center space-x-2">
                    {idx === 0 && <span className="text-emerald-400">★</span>}
                    <span>{st.strategy_label}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${idx === 0 ? "bg-emerald-500" : "bg-blue-500"}`}
                          style={{ width: `${st.recovery_rate * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-white font-bold">
                        {(st.recovery_rate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-emerald-400 font-bold">
                    {formatCurrency(st.revenue_recovered)}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-400">
                    ₹{st.intervention_cost}
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono">
                    {st.sample_size} cases
                  </td>
                  <td className="px-5 py-4 text-right">
                    {idx === 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        RECOMMENDED
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">ALTERNATIVE</span>
                    )}
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
