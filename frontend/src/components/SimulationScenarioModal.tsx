"use client";

import React, { useState } from "react";
import { 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  X, 
  Play, 
  Cpu, 
  Lock, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { api } from "@/lib/api";

interface SimulationScenarioModalProps {
  onClose: () => void;
}

export default function SimulationScenarioModal({ onClose }: SimulationScenarioModalProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>("SCENARIO_1");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scenarios = [
    {
      id: "SCENARIO_1",
      title: "LLM Provider Outage (Graceful Fallback)",
      icon: Cpu,
      color: "text-purple-400 border-purple-500/30 bg-purple-950/20",
      description: "Simulates complete OpenAI/Anthropic gateway outage during active payment analysis. Demonstrates zero-downtime fallback to deterministic rules engine."
    },
    {
      id: "SCENARIO_3",
      title: "Duplicate Request (Idempotency Protection)",
      icon: Lock,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
      description: "Ingests concurrent duplicate retry triggers for transaction TXN_B6ECA65F5F. Demonstrates 100% policy block against double-charging."
    },
    {
      id: "SCENARIO_2",
      title: "Max Retries Guard (Policy Cap = 3)",
      icon: ShieldAlert,
      color: "text-amber-400 border-amber-500/30 bg-amber-950/20",
      description: "Triggers payment failure on customer with 3 existing retries. Demonstrates automatic policy engine block protecting merchant reputation."
    }
  ];

  const handleRunScenario = async () => {
    setRunning(true);
    setResult(null);
    try {
      await new Promise((res) => setTimeout(res, 800));
      const res = await api.triggerFailureScenario(selectedScenario);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Real-World Chaos & Failure Scenario Playground</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Test how RevenueOS handles gateway outages, duplicate triggers, and policy bounds live.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Select Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedScenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setSelectedScenario(s.id); setResult(null); }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/20"
                    : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 ${s.color.split(" ")[0]}`} />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-3">{s.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Spotlight */}
        {currentScenario && (
          <div className={`p-4 rounded-xl border ${currentScenario.color} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Active Chaos Scenario</span>
              <button
                onClick={handleRunScenario}
                disabled={running}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${running ? "animate-spin" : ""}`} />
                <span>{running ? "Executing Chaos..." : "Run Scenario Live"}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300">{currentScenario.description}</p>
          </div>
        )}

        {/* Live Result Inspection */}
        {result && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Engine Simulation Output Result</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Response Code: 200 OK</span>
            </div>

            <div className="overflow-x-auto">
              <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Playground
          </button>
        </div>

      </div>
    </div>
  );
}
