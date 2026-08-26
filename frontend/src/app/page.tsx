"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ExecutiveOverview from "@/components/ExecutiveOverview";
import TransactionExplorer from "@/components/TransactionExplorer";
import RevenueAtRiskView from "@/components/RevenueAtRiskView";
import StrategyOptimizationView from "@/components/StrategyOptimizationView";
import HumanReviewQueue from "@/components/HumanReviewQueue";
import AuditTrailView from "@/components/AuditTrailView";
import PitchDeckModal from "@/components/PitchDeckModal";
import { 
  api, 
  MOCK_METRICS, 
  MOCK_BASELINE, 
  MOCK_MODEL_METRICS, 
  MOCK_TRANSACTIONS 
} from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<any>(MOCK_METRICS);
  const [baselineData, setBaselineData] = useState<any>(MOCK_BASELINE);
  const [modelMetrics, setModelMetrics] = useState<any>(MOCK_MODEL_METRICS);
  const [transactions, setTransactions] = useState<any[]>(MOCK_TRANSACTIONS);
  const [totalTxns, setTotalTxns] = useState(MOCK_TRANSACTIONS.length);
  const [loading, setLoading] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [m, b, mm, txRes] = await Promise.all([
        api.getMetrics(),
        api.getBaselineComparison(),
        api.getModelMetrics(),
        api.getTransactions(0, 50, "ALL", "")
      ]);
      setMetrics(m || MOCK_METRICS);
      setBaselineData(b || MOCK_BASELINE);
      setModelMetrics(mm || MOCK_MODEL_METRICS);
      setTransactions(txRes?.items?.length ? txRes.items : MOCK_TRANSACTIONS);
      setTotalTxns(txRes?.total || MOCK_TRANSACTIONS.length);
    } catch (err) {
      console.error(err);
      setMetrics(MOCK_METRICS);
      setBaselineData(MOCK_BASELINE);
      setModelMetrics(MOCK_MODEL_METRICS);
      setTransactions(MOCK_TRANSACTIONS);
      setTotalTxns(MOCK_TRANSACTIONS.length);
    }
  };

  const handleResetDemo = async () => {
    setIsLoadingDemo(true);
    try {
      await api.resetAndRunDemo();
      await loadAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        isLoadingDemo={isLoadingDemo}
        onOpenPitch={() => setShowPitchModal(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading RevenueOS Intelligent Engine...</p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <ExecutiveOverview
                metrics={metrics}
                baselineData={baselineData}
                modelMetrics={modelMetrics}
                onResetDemo={handleResetDemo}
              />
            )}

            {activeTab === "transactions" && (
              <TransactionExplorer
                transactions={transactions.length ? transactions : MOCK_TRANSACTIONS}
                total={totalTxns || MOCK_TRANSACTIONS.length}
                onRefresh={loadAllData}
              />
            )}

            {activeTab === "revenue_at_risk" && (
              <RevenueAtRiskView />
            )}

            {activeTab === "strategies" && (
              <StrategyOptimizationView />
            )}

            {activeTab === "human_review" && (
              <HumanReviewQueue />
            )}

            {activeTab === "audit" && (
              <AuditTrailView />
            )}
          </>
        )}
      </main>

      {/* Pitch Deck Modal */}
      {showPitchModal && (
        <PitchDeckModal
          onClose={() => setShowPitchModal(false)}
          onResetDemo={handleResetDemo}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-16 py-6 text-center text-xs text-slate-500">
        <p>RevenueOS — AI Revenue Recovery & Safety Engine | Built for Razorpay AI Buildathon Track 03</p>
        <p className="mt-1 text-[10px] text-slate-600">Simulated Payment Environment • Bounded Deterministic Safety Policy • Scikit-Learn + FastAPI + Next.js</p>
      </footer>

    </div>
  );
}
