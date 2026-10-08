import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGateway } from '../../context/GatewayContext';
import { useTheme } from '../../context/ThemeContext';
import { DecisionBadge, RiskBadge, ActionBadge, StatusBadge } from '../../components/common/Badge';
import { AgentSimulator } from '../../components/simulator/AgentSimulator';
import { AgentDetailModal } from '../../components/agent/AgentDetailModal';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Database,
  User,
  History,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
} from 'lucide-react';

export const HrDashboard: React.FC = () => {
  const { user } = useAuth();
  const { agents, requests, resources } = useGateway();
  const { paletteInfo } = useTheme();
  const navigate = useNavigate();

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Priya's personalized AI agent
  const priyaAgent = agents.find((a) => a.id === 'agent-hr-01') || agents[0];

  // Filter requests initiated by Priya's agent
  const priyaRequests = requests.filter((r) => r.agentId === priyaAgent?.id);
  const pendingCount = priyaRequests.filter((r) => r.approvalStatus === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner with White & Blue Dual-Color Theme */}
      <div
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm relative overflow-hidden border-t-4"
        style={{
          borderTopColor: paletteInfo.primaryColor,
        }}
      >
        <div
          className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${paletteInfo.primaryColor}, ${paletteInfo.secondaryColor})` }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || priyaAgent?.avatar}
              alt="Priya Sharma"
              style={{ borderColor: paletteInfo.primaryColor }}
              className="w-16 h-16 rounded-2xl object-cover border-2 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Welcome, Priya
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                >
                  PEOPLE OPERATIONS
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg">
                Your personalized AI agent (<strong>Priya HR Agent</strong>) operates with scoped Zero-Trust credentials to assist your day-to-day HR workflows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/hr/simulator')}
              style={{
                background: `linear-gradient(135deg, ${paletteInfo.primaryColor}, ${paletteInfo.secondaryColor})`,
                boxShadow: `0 4px 16px -2px ${paletteInfo.primaryColor}50`,
              }}
              className="px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 transition cursor-pointer hover:opacity-95"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Use My AI Agent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Principle Alert */}
      <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <strong className="text-blue-800 dark:text-blue-300 font-bold block mb-0.5">
            Zero-Trust Agent Principle:
          </strong>
          While you possess HR Manager executive privileges, <strong>Priya HR Agent</strong> does not inherit unlimited authority. Dangerous mutations or bulk data exports trigger mandatory approval gates to protect company personnel data.
        </div>
      </div>

      {/* "My AI Agents" Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600" />
            My AI Agents
          </h2>
          <span className="text-xs font-mono text-blue-700 dark:text-blue-300 font-semibold">
            1 Bound Autonomous Identity
          </span>
        </div>

        {/* Priya HR Agent Showcase Card */}
        {priyaAgent && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {priyaAgent.name}
                    </h3>
                    <StatusBadge status={priyaAgent.status} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Purpose: {priyaAgent.purpose}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDetailOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Agent Profile
                </button>
                <button
                  onClick={() => navigate('/hr/simulator')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Action</span>
                </button>
              </div>
            </div>

            {/* Agent Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Risk
                </span>
                <div className="mt-1">
                  <RiskBadge score={priyaAgent.riskScore} level={priyaAgent.riskLevel} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Requests Today
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white mt-1 block font-mono">
                  {priyaAgent.totalRequestsToday} queries
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Allowed Actions
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {priyaAgent.allowedActions.map((act) => (
                    <ActionBadge key={act} action={act} />
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Restricted Actions
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {priyaAgent.restrictedActions.map((act) => (
                    <span
                      key={act}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Simulation Studio Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Interactive Agent Action Studio
          </h2>
          <span className="text-xs text-slate-400">
            Simulate live authorization decisions directly below
          </span>
        </div>

        <AgentSimulator initialAgentId={priyaAgent?.id} />
      </div>

      {/* Recent Activity Table for Priya HR Agent */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Agent Activity & Evaluation Decisions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit log of actions executed by <strong>Priya HR Agent</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/hr/audit')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            View Complete History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Enterprise Resource</th>
                <th className="py-2.5 px-3">Purpose / Justification</th>
                <th className="py-2.5 px-3">Evaluation Decision</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {priyaRequests.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <ActionBadge action={req.action} />
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {req.resourceName}
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-slate-600 dark:text-slate-400">
                    {req.purpose}
                  </td>
                  <td className="py-3 px-3">
                    <DecisionBadge decision={req.decision} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge score={req.riskScore} level={req.riskLevel} />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {req.timestamp.split(' ')[1] || req.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      <AgentDetailModal
        agent={priyaAgent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSimulate={() => navigate('/hr/simulator')}
      />
    </div>
  );
};
