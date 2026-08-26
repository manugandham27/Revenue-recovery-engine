"use client";

import React, { useState } from "react";
import { 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from "lucide-react";

interface WhatIfSimulatorModalProps {
  onClose: () => void;
}

export default function WhatIfSimulatorModal({ onClose }: WhatIfSimulatorModalProps) {
  const [amount, setAmount] = useState<number>(25000);
  const [failureType, setFailureType] = useState<string>("temporary_network_failure");
  const [retryCount, setRetryCount] = useState<number>(1);
  const [successRate, setSuccessRate] = useState<number>(0.80);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");

  // Calculate ML Probability dynamically based on features
  const calculateProbability = () => {
    let base = 0.50;
    if (failureType === "temporary_network_failure") base += 0.35;
    if (failureType === "authentication_failure") base += 0.25;
    if (failureType === "insufficient_funds") base -= 0.15;
    if (failureType === "expired_card") base -= 0.30;
    if (failureType === "merchant_configuration") base -= 0.40;

    base += (successRate - 0.5) * 0.4;
    base -= retryCount * 0.12;

    if (amount > 100000) base -= 0.10;
    return Math.min(0.99, Math.max(0.01, base));
  };

  const proba = calculateProbability();
  const expRecoveryAI = amount * proba;
  const expRecoveryBaseline = failureType === "temporary_network_failure" ? amount * 0.20 : amount * 0.05;
  const netGain = expRecoveryAI - expRecoveryBaseline;

  // Determine policy result
  let policyDecision = "ALLOWED";
  let policyReason = "All policy constraints passed. Safe to execute recovery.";
  let recommendedStrategy = "delayed_retry";

  if (retryCount >= 3) {
    policyDecision = "BLOCKED";
    policyReason = `Retry count (${retryCount}) exceeds MAX_RETRIES = 3 cap. Policy safety block.`;
  } else if (amount > 50000) {
    policyDecision = "HUMAN_REVIEW";
    policyReason = `Transaction amount (₹${amount.toLocaleString("en-IN")}) exceeds HIGH_VALUE_THRESHOLD = ₹50,000. Escalate to operator.`;
  } else if (proba < 0.20) {
    policyDecision = "BLOCKED";
    policyReason = `Recoverability score (${(proba * 100).toFixed(0)}%) is below minimum threshold (20%). Negative ROI.`;
  }

  // Strategy mapping
  if (failureType === "expired_card") recommendedStrategy = "alternate_payment_method";
  else if (failureType === "authentication_failure") recommendedStrategy = "customer_notification";
  else if (failureType === "insufficient_funds") recommendedStrategy = "payment_link";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>Interactive What-If Recovery Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate custom payment scenarios to test ML recoverability, policy bounds, and expected ROI live.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulator Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          
          {/* Slider 1: Transaction Amount */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Transaction Amount</span>
              <span className="text-white font-bold font-mono">₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="150000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Select 2: Failure Type */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium block">Failure Type</label>
            <select
              value={failureType}
              onChange={(e) => setFailureType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="temporary_network_failure">Temporary Gateway Network Timeout</option>
              <option value="authentication_failure">3DS / OTP Verification Failed</option>
              <option value="insufficient_funds">Insufficient Account Balance</option>
              <option value="expired_card">Instrument Card Expired</option>
              <option value="merchant_configuration">Merchant Configuration Error</option>
            </select>
          </div>

          {/* Slider 3: Existing Retry Attempts */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Prior Retry Attempts</span>
              <span className="text-white font-bold font-mono">{retryCount} retries</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={retryCount}
              onChange={(e) => setRetryCount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Slider 4: Customer Historical Success Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Customer Success Rate</span>
              <span className="text-white font-bold font-mono">{(successRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.95"
              step="0.05"
              value={successRate}
              onChange={(e) => setSuccessRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

        </div>

        {/* Real-Time Live Outcome Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Predicted Recoverability */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Predicted Recoverability</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{(proba * 100).toFixed(1)}%</p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${proba * 100}%` }} />
            </div>
          </div>

          {/* Card 2: Recommended Strategy */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Recommended Action</span>
            <p className="text-sm font-bold text-blue-400 uppercase tracking-tight">{recommendedStrategy.replace(/_/g, " ")}</p>
            <span className="text-[10px] text-slate-400 block">Expected Delay: 30 mins | Max Retries: 1</span>
          </div>

          {/* Card 3: Deterministic Policy Result */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400">Safety Policy Decision</span>
            <div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                policyDecision === "ALLOWED"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : policyDecision === "HUMAN_REVIEW"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}>
                {policyDecision}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{policyReason}</p>
          </div>

        </div>

        {/* ROI Comparison Box */}
        <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Net Expected Revenue Gain</span>
            <p className="text-2xl font-extrabold text-white mt-1">
              +₹{netGain.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              AI Expected Recovery: <span className="text-emerald-400 font-medium">₹{expRecoveryAI.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span> vs Fixed Retry: ₹{expRecoveryBaseline.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
}
