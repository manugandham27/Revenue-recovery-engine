"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Play, 
  Presentation, 
  RefreshCw, 
  CheckCircle2,
  Sparkles,
  Zap,
  Sliders,
  Menu,
  X
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetDemo: () => void;
  isLoadingDemo: boolean;
  onOpenPitch: () => void;
  onOpenChaosModal: () => void;
  onOpenWhatIfModal: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onResetDemo,
  isLoadingDemo,
  onOpenPitch,
  onOpenChaosModal,
  onOpenWhatIfModal
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Executive Overview", icon: Activity },
    { id: "transactions", label: "Transaction Explorer", icon: ShieldAlert },
    { id: "revenue_at_risk", label: "Revenue at Risk", icon: Sparkles },
    { id: "strategies", label: "Strategy Optimizer", icon: Activity },
    { id: "human_review", label: "Human Review", icon: CheckCircle2 },
    { id: "audit", label: "Audit Trail", icon: RefreshCw },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & System Health Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <span className="text-white font-extrabold text-xl tracking-wider">R</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base md:text-lg tracking-tight">RevenueOS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Engine Healthy</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Revenue Recovery & Safety Engine</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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

        {/* Action Controls (Desktop) */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={onOpenWhatIfModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">What-If Simulator</span>
          </button>

          <button
            onClick={onOpenChaosModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Chaos Playground</span>
          </button>

          <button
            onClick={onOpenPitch}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5 text-purple-200" />
            <span className="hidden xl:inline">5-Min Pitch</span>
          </button>

          <button
            onClick={onResetDemo}
            disabled={isLoadingDemo}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isLoadingDemo ? "animate-spin" : ""}`} />
            <span>{isLoadingDemo ? "Running..." : "Buildathon Run"}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-3 animate-fade-in">

          {/* Mobile Navigation Tabs Grid */}
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Actions Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
            <button
              onClick={() => { onOpenWhatIfModal(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>What-If</span>
            </button>

            <button
              onClick={() => { onOpenChaosModal(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Chaos Run</span>
            </button>

            <button
              onClick={() => { onOpenPitch(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>5-Min Pitch</span>
            </button>

            <button
              onClick={() => { onResetDemo(); setMobileMenuOpen(false); }}
              disabled={isLoadingDemo}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isLoadingDemo ? "animate-spin" : ""}`} />
              <span>Batch Run</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
