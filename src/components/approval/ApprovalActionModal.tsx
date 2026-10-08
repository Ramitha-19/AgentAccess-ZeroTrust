import React, { useState } from 'react';
import { AccessRequest } from '../../types';
import { Modal } from '../common/Modal';
import { DecisionBadge, RiskBadge, ActionBadge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useGateway } from '../../context/GatewayContext';
import { CheckCircle2, XCircle, ShieldAlert, FileText, User } from 'lucide-react';

interface ApprovalActionModalProps {
  request: AccessRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onDone?: () => void;
}

export const ApprovalActionModal: React.FC<ApprovalActionModalProps> = ({
  request,
  isOpen,
  onClose,
  onDone,
}) => {
  const { user } = useAuth();
  const { approveRequest, rejectRequest } = useGateway();
  const [note, setNote] = useState('');

  if (!request) return null;

  const reviewerName = user ? user.name : 'Authorized Security Reviewer';

  const handleApprove = () => {
    approveRequest(request.id, reviewerName, note.trim() || 'Approved after context review');
    setNote('');
    onClose();
    if (onDone) onDone();
  };

  const handleReject = () => {
    rejectRequest(request.id, reviewerName, note.trim() || 'Declined during security governance review');
    setNote('');
    onClose();
    if (onDone) onDone();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dual-Custody Authorization Review"
      subtitle={`Request ID: ${request.id} • ${request.timestamp}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-amber-800 dark:text-amber-300">
              Human-in-the-Loop Approval Required
            </h5>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              Autonomous agent attempted an operation classified as sensitive or exceeding deterministic risk ceilings. Dual-custody supervisor sign-off is mandatory before data egress.
            </p>
          </div>
        </div>

        {/* Request details grid */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">AI Agent:</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{request.agentName}</span>
              <span className="text-slate-400 font-normal">({request.ownerName})</span>
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Target Asset & Action:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {request.resourceName}
              </span>
              <ActionBadge action={request.action} />
            </div>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Calculated Risk Score:</span>
            <RiskBadge score={request.riskScore} level={request.riskLevel} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Network Posture:</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {request.context.networkType} ({request.context.location})
            </span>
          </div>
        </div>

        {/* Operational Purpose */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Agent Stated Purpose
          </h5>
          <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {request.purpose}
          </p>
        </div>

        {/* Risk Breakdown */}
        {request.riskFactors && request.riskFactors.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Risk Factor Analysis
            </h5>
            <div className="space-y-1.5">
              {request.riskFactors.map((rf, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-600 dark:text-slate-400">{rf.factor}:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    +{rf.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviewer Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Reviewer Note / Justification (Recorded in Immutable Audit Log)
          </label>
          <input
            type="text"
            placeholder="e.g. Validated with HR VP for statutory filings"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Decision Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <XCircle className="w-4 h-4" />
              <span>REJECT ACCESS</span>
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPROVE ACCESS</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
