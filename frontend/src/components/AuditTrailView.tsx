"use client";

import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  FileCode, 
  User, 
  ShieldCheck, 
  BrainCircuit, 
  Code,
  Terminal
} from "lucide-react";
import { api } from "@/lib/api";

export default function AuditTrailView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs(100);
      setLogs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActorBadge = (actor: string) => {
    if (actor?.includes("HUMAN")) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HUMAN OPERATOR</span>;
    }
    if (actor?.includes("POLICY")) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">POLICY ENGINE</span>;
    }
    if (actor?.includes("ML") || actor?.includes("LLM")) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">AI LAYER</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">SYSTEM</span>;
  };

  const filteredLogs = logs.filter(l => 
    !search || 
    (l.transaction_id && l.transaction_id.toLowerCase().includes(search.toLowerCase())) ||
    (l.event_type && l.event_type.toLowerCase().includes(search.toLowerCase())) ||
    (l.summary && l.summary.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="py-12 text-center text-slate-400 text-xs">Loading Audit Logs...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <span>Immutable Decision Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete compliance log tracking every AI prediction, diagnosis, policy validation, and execution step.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Transaction</th>
                <th className="px-5 py-3.5">Event Type</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Audit Summary</th>
                <th className="px-5 py-3.5 text-right">Raw JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 font-mono">
                  <td className="px-5 py-3.5 text-slate-400 text-[11px] font-sans">{log.timestamp}</td>
                  <td className="px-5 py-3.5 text-white font-bold">{log.transaction_id || `ID #${log.payment_id}`}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-blue-400 font-semibold font-sans">{log.event_type}</span>
                  </td>
                  <td className="px-5 py-3.5 font-sans">{getActorBadge(log.actor)}</td>
                  <td className="px-5 py-3.5 font-sans text-slate-200 max-w-md truncate">{log.summary}</td>
                  <td className="px-5 py-3.5 text-right">
                    {log.details && (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-sans text-[11px] transition-all cursor-pointer"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
              <h3 className="text-sm font-bold text-white">Audit Log Details #{selectedLog.id}</h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-emerald-400 overflow-x-auto max-h-96">
              {JSON.stringify(selectedLog.details, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
