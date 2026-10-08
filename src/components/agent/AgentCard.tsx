import React from 'react';
import { Agent } from '../../types';
import { StatusBadge, RiskBadge, ActionBadge } from '../common/Badge';
import { Bot, User, Activity, ExternalLink, Sparkles, Shield, Clock } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onInspect: (agent: Agent) => void;
  onSimulate: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onInspect, onSimulate }) => {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={agent.avatar}
              alt={agent.ownerName}
              className="w-10 h-10 rounded-xl object-cover border border-blue-200 dark:border-blue-800"
            />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {agent.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3 text-blue-600" />
                <span>{agent.ownerName}</span>
                <span>•</span>
                <span>{agent.department}</span>
              </p>
            </div>
          </div>
          <StatusBadge status={agent.status} />
        </div>

        {/* Purpose */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {agent.purpose}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Risk Score
            </span>
            <div className="mt-1">
              <RiskBadge score={agent.riskScore} level={agent.riskLevel} />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Today's Volume
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block font-mono">
              {agent.totalRequestsToday} reqs
            </span>
          </div>
        </div>

        {/* Allowed Actions */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Allowed Actions:
          </span>
          <div className="flex flex-wrap gap-1">
            {agent.allowedActions.map((act) => (
              <ActionBadge key={act} action={act} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onInspect(agent)}
          className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
        >
          Inspect Profile
        </button>
        <button
          onClick={() => onSimulate(agent.id)}
          className="py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Simulate</span>
        </button>
      </div>
    </div>
  );
};
