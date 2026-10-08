import React from 'react';
import { Agent } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, RiskBadge, ActionBadge } from '../common/Badge';
import { useGateway } from '../../context/GatewayContext';
import { Bot, User, Key, Calendar, Activity, CheckCircle, Ban, ShieldCheck, Cpu } from 'lucide-react';

interface AgentDetailModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulate?: (agentId: string) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSimulate,
}) => {
  const { resources, updateAgent } = useGateway();

  if (!agent) return null;

  const handleToggleStatus = () => {
    const nextStatus = agent.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateAgent(agent.id, { status: nextStatus });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={agent.name}
      subtitle={`Agent ID: ${agent.id}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Header Profile Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={agent.avatar}
              alt={agent.ownerName}
              className="w-12 h-12 rounded-xl object-cover border border-blue-200 dark:border-blue-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {agent.name}
                </h4>
                <StatusBadge status={agent.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Owner: <strong>{agent.ownerName}</strong> ({agent.department})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                agent.status === 'ACTIVE'
                  ? 'border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
                  : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              {agent.status === 'ACTIVE' ? 'Suspend Agent' : 'Activate Agent'}
            </button>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Mandated Autonomous Purpose
          </h5>
          <p className="text-xs text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 leading-relaxed">
            {agent.purpose}
          </p>
        </div>

        {/* Security & Risk Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Risk Profile
            </div>
            <div className="mt-1.5">
              <RiskBadge score={agent.riskScore} level={agent.riskLevel} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Activity Velocity
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {agent.totalRequestsToday} requests today
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Last active: {agent.lastActive}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Edge Registration
            </div>
            <div className="mt-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 truncate">
              {agent.createdAt}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Cloudflare D1 edge node</div>
          </div>
        </div>

        {/* Allowed and Restricted Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Allowed Operations
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {agent.allowedActions.map((act) => (
                <ActionBadge key={act} action={act} />
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-500" />
              Restricted Operations
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {agent.restrictedActions.map((act) => (
                <span
                  key={act}
                  className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                >
                  {act} (Requires Approval / Blocked)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bound Enterprise Resources */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Accessible Enterprise Resources
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {agent.allowedResources.map((resId) => {
              const res = resources.find((r) => r.id === resId);
              return (
                <div
                  key={resId}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {res?.name || resId}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{res?.type}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {res?.sensitivity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cloudflare Edge Durable Object Binding */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600 dark:text-slate-400">
              Cloudflare Durable Object:
            </span>
            <code className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
              {agent.edgeKeyId}
            </code>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
          {onSimulate && (
            <button
              onClick={() => {
                onClose();
                onSimulate(agent.id);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              Simulate Action With Agent
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
