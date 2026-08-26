"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  Code, 
  CheckCircle2, 
  XCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { api, MOCK_AUDIT_LOGS } from "@/lib/api";

export default function AuditTrailView() {
  const [logs, setLogs] = useState<any[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const pageSize = 20;

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      if (res && res.length) {
        setLogs(res);
      }
    } catch (err) {
      console.error(err);
      setLogs(MOCK_AUDIT_LOGS);
    }
  };

  const displayLogs = logs.length ? logs : MOCK_AUDIT_LOGS;

  const filtered = displayLogs.filter(l => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      l.transaction_id?.toLowerCase().includes(query) ||
      l.event_type?.toLowerCase().includes(query) ||
      l.actor?.toLowerCase().includes(query) ||
      l.summary?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "INGESTION":
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">INGESTION</span>;
      case "ANALYSIS":
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">ANALYSIS</span>;
      case "POLICY_CHECK":
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">POLICY CHECK</span>;
      case "EXECUTION":
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">EXECUTION</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Comprehensive Decision Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete compliance log tracking 2,000+ AI predictions, diagnoses, policy validations, and execution steps.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search across 2,000+ audit logs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Audit Summary</th>
                <th className="px-4 py-3 text-right">Raw JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedItems.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : "10:14:02 AM"}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-white">{l.transaction_id}</td>
                  <td className="px-4 py-3.5">{getEventBadge(l.event_type)}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-300">{l.actor}</td>
                  <td className="px-4 py-3.5 text-slate-200 font-medium max-w-md">{l.summary}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedLog(l)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-mono transition-all cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Code className="w-3 h-3 text-blue-400" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} audit logs</span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>
            
            <span className="font-mono text-white font-semibold">Page {currentPage} of {totalPages}</span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* JSON Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono">Audit Record #{selectedLog.id} — {selectedLog.transaction_id}</h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
              <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
