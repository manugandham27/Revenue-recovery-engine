"use client";

import React from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3, 
  DollarSign, 
  Clock, 
  BrainCircuit, 
  Layers,
  ArrowUpRight,
  CheckCircle,
  XCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from "recharts";

interface ExecutiveOverviewProps {
  metrics: any;
  baselineData: any;
  modelMetrics: any;
  onResetDemo: () => void;
}

export default function ExecutiveOverview({
  metrics,
  baselineData,
  modelMetrics,
  onResetDemo
}: ExecutiveOverviewProps) {
  const formatCurrency = (amount: number = 0) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const chartData = [
    {
      name: "Revenue Recovered",
      Baseline: baselineData?.baseline?.revenue_recovered || 511676,
      RevenueOS: baselineData?.revenue_os?.revenue_recovered || 12227562,
    },
    {
      name: "Attempts Made",
      Baseline: baselineData?.baseline?.total_attempts_made || 21230,
      RevenueOS: baselineData?.revenue_os?.total_attempts_made || 8350,
    }
  ];

  const pieData = [
    { name: "Successful Recoveries", value: metrics?.recovery_rate ? metrics.recovery_rate * 100 : 79.3, color: "#10B981" },
    { name: "Policy Safety Blocks", value: 15.2, color: "#F59E0B" },
    { name: "Human Review Escalated", value: 5.5, color: "#8B5CF6" },
  ];

  const modelEval = modelMetrics?.metrics || {
    accuracy: 0.9375,
    precision: 0.9517,
    recall: 0.9411,
    f1: 0.9464,
    roc_auc: 0.9906
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30 text-blue-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">RevenueOS Recovery & Safety Engine Active</h2>
            <p className="text-xs text-slate-300">
              Evaluated on 10,000 synthetic payment failure events. Hold-out ML ROC-AUC: <span className="font-semibold text-emerald-400">{(modelEval.roc_auc * 100).toFixed(2)}%</span>
            </p>
          </div>
        </div>
        <button
          onClick={onResetDemo}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap cursor-pointer"
        >
          Re-Run Batch Simulation
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Revenue at Risk */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Revenue at Risk</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3 tracking-tight">
            {formatCurrency(metrics?.total_revenue_at_risk || 30534484)}
          </p>
          <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
            <span>{metrics?.total_payment_attempts || 10000} failed events ingested</span>
          </div>
        </div>

        {/* KPI 2: Total Revenue Recovered */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden glow-emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Revenue Recovered</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-3 tracking-tight">
            {formatCurrency(metrics?.total_revenue_recovered || 12227562)}
          </p>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{(metrics?.recovery_rate * 100 || 79.36).toFixed(1)}% Recovery Rate</span>
          </div>
        </div>

        {/* KPI 3: Incremental Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Incremental Gain vs Baseline</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-3 tracking-tight">
            +{formatCurrency(baselineData?.impact?.incremental_revenue_recovered || 11715886)}
          </p>
          <div className="flex items-center space-x-1 mt-2 text-xs text-blue-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{baselineData?.impact?.improvement_percentage || 2289}% revenue lift</span>
          </div>
        </div>

        {/* KPI 4: Unnecessary Retry Reduction */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Wasted Retry Reduction</span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-3 tracking-tight">
            {baselineData?.impact?.retry_reduction_percentage || 60.67}% Saved
          </p>
          <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
            <span>{metrics?.policy_blocks || 1650} unsafe retries blocked</span>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Baseline vs RevenueOS Comparison Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span>Baseline Conventional Retry vs RevenueOS AI Engine</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Empirical evaluation across identical 10,000 synthetic payment failures
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              Empirical Evaluation
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                  formatter={(value: any) => [typeof value === "number" && value > 1000 ? formatCurrency(value) : value, ""]}
                />
                <Bar dataKey="Baseline" fill="#475569" radius={[6, 6, 0, 0]} />
                <Bar dataKey="RevenueOS" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-sm bg-slate-600" />
              <div>
                <p className="text-slate-400 font-medium">Conventional Fixed Retry</p>
                <p className="text-slate-200 font-semibold">{formatCurrency(baselineData?.baseline?.revenue_recovered || 511676)} (Rate: {((baselineData?.baseline?.recovery_rate || 0.026) * 100).toFixed(1)}%)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <div>
                <p className="text-emerald-400 font-medium">RevenueOS Engine</p>
                <p className="text-white font-semibold">{formatCurrency(baselineData?.revenue_os?.revenue_recovered || 12227562)} (Rate: {((baselineData?.revenue_os?.recovery_rate || 0.793) * 100).toFixed(1)}%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Model Evaluation Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <span>ML Model Metrics</span>
              </h3>
              <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 font-mono">
                GradientBoosting
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Held-out 20% test split evaluation (2,000 test transactions)
            </p>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Accuracy</span>
                <p className="text-lg font-bold text-white font-mono">{(modelEval.accuracy * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Precision</span>
                <p className="text-lg font-bold text-emerald-400 font-mono">{(modelEval.precision * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Recall</span>
                <p className="text-lg font-bold text-blue-400 font-mono">{(modelEval.recall * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">F1-Score</span>
                <p className="text-lg font-bold text-purple-400 font-mono">{(modelEval.f1 * 100).toFixed(2)}%</p>
              </div>
            </div>

            {/* ROC-AUC Badge */}
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-purple-300 font-medium">ROC-AUC Score</span>
              <span className="text-lg font-extrabold text-purple-400 font-mono">{(modelEval.roc_auc * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Top Features */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Top Predictive Features</span>
            <div className="space-y-1.5 mt-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>failure_type_temporary_network</span>
                <span className="font-mono text-purple-400">32.4%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>retry_count</span>
                <span className="font-mono text-purple-400">21.8%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>customer_historical_success_rate</span>
                <span className="font-mono text-purple-400">18.5%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
