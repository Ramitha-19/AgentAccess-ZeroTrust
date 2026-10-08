import React from 'react';
import { AgentSimulator } from '../../components/simulator/AgentSimulator';
import { useGateway } from '../../context/GatewayContext';
import { Sparkles, Bot, Shield, CheckCircle2, Layers } from 'lucide-react';

export const HrAgentStudio: React.FC = () => {
  const { agents } = useGateway();
  const priyaAgent = agents.find((a) => a.id === 'agent-hr-01') || agents[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm border-t-4 border-t-blue-600">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Use My AI Agent Studio
          </h1>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
          Dispatch operational tasks through <strong>{priyaAgent?.name}</strong>. Watch the AgentAccess security gateway evaluate contextual velocity, match deterministic edge policies, calculate real-time risk scores, and enforce human approval boundaries.
        </p>
      </div>

      {/* Simulator Component */}
      <AgentSimulator initialAgentId={priyaAgent?.id} />

      {/* Educational Guideline Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          How AgentAccess Protects Personnel Data:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600 dark:text-slate-400">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <strong className="text-slate-800 dark:text-slate-200 block mb-1">1. READ Operations</strong>
            Standard employee tenure or payroll lookups are allowed when risk scores remain beneath the safety ceiling (score &lt; 40).
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <strong className="text-slate-800 dark:text-slate-200 block mb-1">2. EXPORT Operations</strong>
            Bulk exports of employee payroll data are flagged for dual-custody approval to prevent data leakage.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <strong className="text-slate-800 dark:text-slate-200 block mb-1">3. DELETE Operations</strong>
            Destructive deletions against primary transactional payroll ledgers are permanently blocked by Zero Trust policy.
          </div>
        </div>
      </div>
    </div>
  );
};
