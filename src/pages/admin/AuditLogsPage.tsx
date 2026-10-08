import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { DecisionBadge, RiskBadge, ActionBadge } from '../../components/common/Badge';
import { AuditLog, DecisionType } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Hash,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useGateway();

  const [searchTerm, setSearchTerm] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | DecisionType>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.requestId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDecision = decisionFilter === 'ALL' || log.decision === decisionFilter;
    return matchesSearch && matchesDecision;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'Timestamp,RequestID,Agent,Owner,Action,Resource,Decision,RiskScore,Reason,Hash\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.timestamp}","${l.requestId}","${l.agentName}","${l.ownerName}","${l.action}","${l.resourceName}","${l.decision}",${l.riskScore},"${l.reason.replace(/"/g, '""')}","${l.hash}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentaccess_audit_trail_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Immutable Compliance Audit Trail
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              TAMPER-EVIDENT HASH CHAIN
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every authorization decision is recorded with deterministic justification, agent identity token, and cryptographic hash verification.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit reasons, agent, or requestId..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Filter Decision:</span>
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Outcomes</option>
            <option value="ALLOW">ALLOW</option>
            <option value="REQUIRE_APPROVAL">REQUIRE APPROVAL</option>
            <option value="DENY">DENY</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Agent & Human Owner</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Resource</th>
              <th className="py-3 px-3">Decision</th>
              <th className="py-3 px-3">Risk</th>
              <th className="py-3 px-3">Statutory Justification Reason</th>
              <th className="py-3 px-3">Hash Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {log.timestamp}
                </td>

                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {log.agentName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Owner: {log.ownerName}
                  </div>
                </td>

                <td className="py-3 px-3 whitespace-nowrap">
                  <ActionBadge action={log.action} />
                </td>

                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {log.resourceName}
                </td>

                <td className="py-3 px-3 whitespace-nowrap">
                  <DecisionBadge decision={log.decision} size="sm" />
                </td>

                <td className="py-3 px-3 whitespace-nowrap">
                  <RiskBadge score={log.riskScore} />
                </td>

                <td className="py-3 px-3 max-w-sm">
                  <p
                    className="text-slate-600 dark:text-slate-300 line-clamp-2 cursor-pointer hover:underline"
                    onClick={() => setSelectedLog(log)}
                    title="Click to read complete statutory reason"
                  >
                    {log.reason}
                  </p>
                </td>

                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                    <Hash className="w-3 h-3 text-blue-600" />
                    <span>{log.hash}</span>
                    <button
                      onClick={() => handleCopyHash(log.hash)}
                      className="ml-1 text-slate-400 hover:text-blue-600 transition"
                      title="Copy Hash"
                    >
                      {copiedHash === log.hash ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Log Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="Audit Trail Record"
          subtitle={`Log ID: ${selectedLog.id} • Request: ${selectedLog.requestId}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block mb-0.5">Decision:</span>
                <DecisionBadge decision={selectedLog.decision} size="md" />
              </div>
              <div className="text-right">
                <span className="text-slate-400 block mb-0.5">Risk Score:</span>
                <RiskBadge score={selectedLog.riskScore} />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Agent:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedLog.agentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Owner:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedLog.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Operation:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{selectedLog.action} on {selectedLog.resourceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono">{selectedLog.timestamp}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Statutory Reason & Policy Enforcement Trace:
              </span>
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 leading-relaxed text-slate-800 dark:text-slate-200">
                {selectedLog.reason}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">Cryptographic Fingerprint:</span>
              <code className="text-[11px] font-mono text-blue-600 dark:text-blue-400 break-all">
                {selectedLog.hash}
              </code>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
