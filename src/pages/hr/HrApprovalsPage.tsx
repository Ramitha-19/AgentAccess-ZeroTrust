import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { useAuth } from '../../context/AuthContext';
import { DecisionBadge, RiskBadge, ActionBadge } from '../../components/common/Badge';
import { ApprovalActionModal } from '../../components/approval/ApprovalActionModal';
import { AccessRequest } from '../../types';
import { Clock, CheckCircle2, XCircle, AlertTriangle, User } from 'lucide-react';

export const HrApprovalsPage: React.FC = () => {
  const { requests, approveRequest, rejectRequest } = useGateway();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);

  // Filter requests initiated by Priya HR Agent or involving HR resources
  const priyaRequests = requests.filter(
    (r) => r.agentId === 'agent-hr-01' || r.resourceId === 'res-payroll' || r.resourceId === 'res-emp-records'
  );
  const pendingRequests = priyaRequests.filter((r) => r.approvalStatus === 'PENDING');
  const reviewedRequests = priyaRequests.filter(
    (r) => r.approvalStatus === 'APPROVED' || r.approvalStatus === 'REJECTED'
  );

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          HR Department Approval Queue
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review sensitive data access and bulk export operations initiated by <strong>Priya HR Agent</strong>.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          Pending Approvals ({pendingRequests.length})
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              No Pending Requests
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              All operations by Priya HR Agent have been cleared or are within normal safe limits.
            </p>
          </div>
        ) : (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl border border-amber-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {req.agentName}
                    </span>
                    <ActionBadge action={req.action} />
                    <span className="text-xs font-semibold">{req.resourceName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                    ID: {req.id} • {req.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge score={req.riskScore} level={req.riskLevel} />
                  <DecisionBadge decision={req.decision} size="sm" />
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Stated Purpose:</strong> {req.purpose}
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
                >
                  Review & Sign-Off
                </button>
              </div>
            </div>
          ))
        )}

        {/* Completed History */}
        {reviewedRequests.length > 0 && (
          <div className="pt-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Previously Reviewed
            </h3>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2 px-3">Request</th>
                    <th className="py-2 px-3">Operation</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Reviewed By</th>
                    <th className="py-2 px-3">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {reviewedRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {req.id}
                      </td>
                      <td className="py-2.5 px-3">
                        {req.action} on {req.resourceName}
                      </td>
                      <td className="py-2.5 px-3">
                        <DecisionBadge decision={req.decision} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {req.reviewedBy || 'Reviewer'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 italic max-w-xs truncate">
                        "{req.approvalNote || 'Verified'}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ApprovalActionModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};
