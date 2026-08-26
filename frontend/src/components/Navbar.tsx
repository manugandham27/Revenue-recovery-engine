"use client";

import React from "react";
import { 
  ShieldAlert, 
  Activity, 
  Play, 
  Presentation, 
  RefreshCw, 
  CheckCircle2,
  Sparkles,
  Zap
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetDemo: () => void;
  isLoadingDemo: boolean;
  onOpenPitch: () => void;
  onOpenChaosModal: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onResetDemo,
  isLoadingDemo,
  onOpenPitch,
  onOpenChaosModal
}: NavbarProps) {
  const tabs = [
    { id: "overview", label: "Executive Overview", icon: Activity },
    { id: "transactions", label: "Transaction Explorer", icon: ShieldAlert },
    { id: "revenue_at_risk", label: "Revenue at Risk", icon: Sparkles },
    { id: "strategies", label: "Strategy Optimizer", icon: Activity },
    { id: "human_review", label: "Human Review", icon: CheckCircle2 },
    { id: "audit", label: "Audit Trail", icon: RefreshCw },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-extrabold text-xl tracking-wider">R</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-lg tracking-tight">RevenueOS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                Track 03
              </span>
            </div>
            <p className="text-xs text-slate-400">AI Revenue Recovery & Safety Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenChaosModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Chaos Playground</span>
          </button>

          <button
            onClick={onOpenPitch}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5 text-purple-200" />
            <span>5-Min Pitch Mode</span>
          </button>

          <button
            onClick={onResetDemo}
            disabled={isLoadingDemo}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isLoadingDemo ? "animate-spin" : ""}`} />
            <span>{isLoadingDemo ? "Running..." : "Buildathon Demo Run"}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
