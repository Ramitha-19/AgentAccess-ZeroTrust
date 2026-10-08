import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { DecisionBadge, RiskBadge, ActionBadge } from '../../components/common/Badge';
import { Search, History, Hash } from 'lucide-react';

export const HrAuditPage: React.FC = () => {
  const { auditLogs } = useGateway();
  const [searchTerm, setSearchTerm] = useState('');

  // Logs for Priya HR Agent
  const priyaLogs = auditLogs.filter(
    (l) => l.agentName.includes('Priya') || l.ownerName.includes('Priya')
  );

  const filteredLogs = priyaLogs.filter(
    (l) =>
      l.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Priya HR Agent Audit History
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Historical log of every request submitted through your personalized agent, showing policy determinations and cryptographic audit hashes.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action reasons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Resource</th>
              <th className="py-2.5 px-3">Decision</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3">Enforcement Reason</th>
              <th className="py-2.5 px-3">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-3 px-3">
                  <ActionBadge action={log.action} />
                </td>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  {log.resourceName}
                </td>
                <td className="py-3 px-3">
                  <DecisionBadge decision={log.decision} size="sm" />
                </td>
                <td className="py-3 px-3">
                  <RiskBadge score={log.riskScore} />
                </td>
                <td className="py-3 px-3 max-w-sm text-slate-600 dark:text-slate-300">
                  {log.reason}
                </td>
                <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                  {log.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
