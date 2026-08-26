"use client";

import React, { useState } from "react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  ShieldAlert, 
  TrendingUp, 
  BrainCircuit, 
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";

interface PitchDeckModalProps {
  onClose: () => void;
  onResetDemo: () => void;
}

export default function PitchDeckModal({ onClose, onResetDemo }: PitchDeckModalProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [liveTestScenario, setLiveTestScenario] = useState<any>(null);
  const [loadingScenario, setLoadingScenario] = useState(false);

  const pitchStages = [
    {
      time: "0:00 – 0:30",
      title: "1. The Revenue Recovery Problem",
      subtitle: "Blind retries waste resources & degrade customer trust",
      content: (
        <div className="space-y-4 text-xs">
          <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-xl text-rose-200">
            <p className="font-semibold text-sm text-rose-400 mb-1">Traditional Problem:</p>
            <p>
              When payments fail, standard payment gateways blindly retry payments 3-4 times. This wastes network fees, incurs penalty charges on expired cards/insufficient funds, and triggers issuer bank fraud alarms.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Wasted Retries</span>
              <span className="text-rose-400 font-bold text-base">20,702 / 21,230</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Conventional Recovery Rate</span>
              <span className="text-amber-400 font-bold text-base">2.64%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      time: "0:30 – 1:00",
      title: "2. The RevenueOS Solution",
      subtitle: "Predictive ML + Semantic Diagnosis + Deterministic Policy Safety",
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            RevenueOS decouples risk evaluation into specialized layers:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/30">
              <span className="text-blue-400 font-bold block mb-1">1. ML Recoverability</span>
              <p className="text-slate-400">GradientBoosting model trained on 10k events with held-out ROC-AUC of 99.06%.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/30">
              <span className="text-purple-400 font-bold block mb-1">2. AI Diagnosis Layer</span>
              <p className="text-slate-400">LLM root cause reasoning with deterministic fallback if API is offline.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30">
              <span className="text-amber-400 font-bold block mb-1">3. Deterministic Policy</span>
              <p className="text-slate-400">Safety engine enforcing max retries, high value review, and idempotency bounds.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-400 font-bold block mb-1">4. Strategy Selection</span>
              <p className="text-slate-400">Selecting optimal recovery action (delayed retry, payment link, alternate method).</p>
            </div>
          </div>
        </div>
      )
    },
    {
      time: "1:00 – 2:00",
      title: "3. Live Decision Pipeline Demo",
      subtitle: "Interactive step-by-step transaction walkthrough",
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Click below to trigger a live production failure scenario evaluation:
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={async () => {
                setLoadingScenario(true);
                const res = await api.triggerFailureScenario("SCENARIO_1");
                setLiveTestScenario(res);
                setLoadingScenario(false);
              }}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all cursor-pointer"
            >
              Test 1: LLM Outage (Fallback)
            </button>

            <button
              onClick={async () => {
                setLoadingScenario(true);
                const res = await api.triggerFailureScenario("SCENARIO_3");
                setLiveTestScenario(res);
                setLoadingScenario(false);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all cursor-pointer"
            >
              Test 2: Idempotency Duplicate Block
            </button>

            <button
              onClick={async () => {
                setLoadingScenario(true);
                const res = await api.triggerFailureScenario("SCENARIO_5");
                setLiveTestScenario(res);
                setLoadingScenario(false);
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-all cursor-pointer"
            >
              Test 3: Max Retries Policy Block
            </button>
          </div>

          {liveTestScenario && (
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48">
              {JSON.stringify(liveTestScenario, null, 2)}
            </pre>
          )}
        </div>
      )
    },
    {
      time: "2:00 – 3:00",
      title: "4. Empirical Business Results",
      subtitle: "Measurable revenue recovery lift on 10,000 synthetic events",
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block font-medium">Conventional Fixed Retry</span>
              <p className="text-xl font-bold text-slate-300 mt-1">₹5.11 Lakhs Recovered</p>
              <p className="text-[10px] text-rose-400 mt-1">21,230 attempts made | 2.64% success rate</p>
            </div>
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-400 block font-medium">RevenueOS AI Recovery</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">₹1.22 Crore Recovered</p>
              <p className="text-[10px] text-emerald-300 mt-1">8,350 attempts made | 79.36% success rate</p>
            </div>
          </div>
          <div className="bg-blue-950/30 border border-blue-500/30 p-3 rounded-xl text-center">
            <span className="text-blue-300 font-bold text-sm">+₹1.17 Crore Net Incremental Recovery (+2,289% Lift)</span>
          </div>
        </div>
      )
    },
    {
      time: "3:00 – 4:00",
      title: "5. Recovery Strategy Optimization",
      subtitle: "Dynamic strategy selection per failure reason",
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-slate-300">
            RevenueOS builds an empirical matrix mapping failure reasons to top-performing strategies:
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-300 font-medium">Temporary Gateway Network Failure</span>
              <span className="text-emerald-400 font-bold">Delayed Retry (68.0% Recovery)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-300 font-medium">Instrument Card Expired</span>
              <span className="text-emerald-400 font-bold">Alternate Payment Method (72.0%)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-300 font-medium">Customer 3DS / OTP Timeout</span>
              <span className="text-emerald-400 font-bold">WhatsApp Payment Link (62.0%)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      time: "4:00 – 5:00",
      title: "6. Production Reliability & Safety",
      subtitle: "Human review, policy bounds, idempotency & failure handling",
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Safety features designed for enterprise Razorpay payment infrastructure:
          </p>
          <ul className="space-y-2 text-slate-300 list-disc list-inside">
            <li><strong className="text-white">Deterministic Safety Policy:</strong> AI only recommends; policy engine approves or blocks.</li>
            <li><strong className="text-white">Human-in-the-Loop Queue:</strong> High-value (&gt;₹50,000) & low confidence cases escalate to human ops.</li>
            <li><strong className="text-white">Idempotency Locks:</strong> Guarantee recovery actions never execute twice accidentally.</li>
            <li><strong className="text-white">Graceful Fallback:</strong> If LLM API fails, deterministic heuristics take over without downtime.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">
              {pitchStages[currentStage].time}
            </span>
            <h2 className="text-lg font-bold text-white mt-1">{pitchStages[currentStage].title}</h2>
            <p className="text-xs text-slate-400">{pitchStages[currentStage].subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Content */}
        <div className="min-h-[240px] flex flex-col justify-center">
          {pitchStages[currentStage].content}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
            disabled={currentStage === 0}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {pitchStages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStage(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentStage === idx ? "bg-purple-500 w-6" : "bg-slate-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentStage(prev => Math.min(pitchStages.length - 1, prev + 1))}
            disabled={currentStage === pitchStages.length - 1}
            className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
