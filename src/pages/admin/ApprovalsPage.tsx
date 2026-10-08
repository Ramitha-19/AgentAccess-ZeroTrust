import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { useAuth } from '../../context/AuthContext';
import { AccessRequest } from '../../types';
import { DecisionBadge, RiskBadge, ActionBadge } from '../../components/common/Badge';
import { ApprovalActionModal } from '../../components/approval/ApprovalActionModal';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  User,
  FileText,
  Sparkles,
} from 'lucide-react';

export const ApprovalsPage: React.FC = () => {
  const { requests, approveRequest, rejectRequest } = useGateway();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);

  const pendingRequests = requests.filter((r) => r.approvalStatus === 'PENDING');
  const historyRequests = requests.filter(
    (r) => r.approvalStatus === 'APPROVED' || r.approvalStatus === 'REJECTED'
  );

  const reviewerName = user ? user.name : 'Vikram Malhotra (CISO)';

  const handleQuickApprove = (reqId: string) => {
    approveRequest(reqId, reviewerName, 'Approved via one-click governance review');
  };

  const handleQuickReject = (reqId: string) => {
    rejectRequest(reqId, reviewerName, 'Rejected due to exfiltration sensitivity');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Dual-Custody Approval Queue
            </h1>
            {pendingRequests.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                {pendingRequests.length} ACTION REQUIRED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Human-in-the-loop authorization gates for high-risk operations, mass exports, and sensitive record updates.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending ({pendingRequests.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>History ({historyRequests.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                All Approval Queues Clear
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No autonomous AI agent requests currently awaiting human signoff.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-amber-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:border-amber-500/50 transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {req.agentName}
                        </span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Owner: <strong>{req.ownerName}</strong>
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                        Request ID: {req.id} • {req.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RiskBadge score={req.riskScore} level={req.riskLevel} />
                    <DecisionBadge decision={req.decision} size="sm" />
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block mb-1">Target Asset & Action</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {req.resourceName}
                      </span>
                      <ActionBadge action={req.action} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 md:col-span-2">
                    <span className="text-slate-400 block mb-1">Agent Stated Purpose</span>
                    <p className="text-slate-800 dark:text-slate-200 line-clamp-2">
                      {req.purpose}
                    </p>
                  </div>
                </div>

                {/* Risk Factors preview */}
                {req.riskFactors && req.riskFactors.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Exfiltration / Risk Drivers:
                    </span>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {req.riskFactors.map((rf, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-amber-500/20 text-slate-700 dark:text-slate-300 text-[11px]"
                        >
                          {rf.factor} (+{rf.points})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Open Full Inspection Drawer
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickReject(req.id)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>REJECT</span>
                    </button>
                    <button
                      onClick={() => handleQuickApprove(req.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>APPROVE</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* History Tab */
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-3">Request ID</th>
                <th className="py-3 px-3">Agent & Owner</th>
                <th className="py-3 px-3">Operation</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Reviewed By</th>
                <th className="py-3 px-3">Reviewer Note</th>
                <th className="py-3 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {historyRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    No completed approval history yet.
                  </td>
                </tr>
              ) : (
                historyRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {req.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {req.agentName}
                      </div>
                      <div className="text-[10px] text-slate-400">{req.ownerName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <ActionBadge action={req.action} />
                        <span className="font-semibold">{req.resourceName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {req.approvalStatus === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {req.reviewedBy || 'Security Supervisor'}
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-500 dark:text-slate-400 italic">
                      "{req.approvalNote || 'Operational sign-off completed'}"
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {req.reviewedAt || req.timestamp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <ApprovalActionModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
