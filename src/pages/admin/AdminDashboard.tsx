import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/common/MetricCard';
import { DecisionBadge, RiskBadge, ActionBadge, StatusBadge } from '../../components/common/Badge';
import { RegisterAgentModal } from '../../components/agent/RegisterAgentModal';
import { CreatePolicyModal } from '../../components/policy/CreatePolicyModal';
import { ApprovalActionModal } from '../../components/approval/ApprovalActionModal';
import { AccessRequest, Agent } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Bot,
  ShieldCheck,
  ShieldX,
  Clock,
  ShieldAlert,
  ArrowRightLeft,
  FileKey,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { agents, requests, policies, resources } = useGateway();
  const { user } = useAuth();
  const { paletteInfo } = useTheme();
  const navigate = useNavigate();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [selectedPendingRequest, setSelectedPendingRequest] = useState<AccessRequest | null>(null);

  // Derived metrics
  const activeAgentsCount = agents.filter((a) => a.status === 'ACTIVE').length;
  const highRiskAgentsCount = agents.filter((a) => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length;
  const pendingApprovalsCount = requests.filter((r) => r.approvalStatus === 'PENDING').length;
  const allowedRequestsCount = requests.filter((r) => r.decision === 'ALLOW').length;
  const deniedRequestsCount = requests.filter((r) => r.decision === 'DENY').length;
  const totalVolumeToday = agents.reduce((acc, a) => acc + a.totalRequestsToday, 0) + requests.length;

  // Chart data 1: Hourly request volume
  const hourlyActivityData = [
    { time: '14:00', allowed: 120, approval: 14, denied: 4 },
    { time: '15:00', allowed: 185, approval: 22, denied: 8 },
    { time: '16:00', allowed: 240, approval: 35, denied: 19 },
    { time: '17:00', allowed: 290, approval: 28, denied: 12 },
    { time: '18:00', allowed: 160, approval: 18, denied: 9 },
    { time: '19:00', allowed: 95, approval: 8, denied: 3 },
    { time: '20:00', allowed: 140, approval: 16, denied: 7 },
  ];

  // Chart data 2: Decision distribution
  const decisionChartData = [
    { name: 'ALLOW', value: allowedRequestsCount || 18, color: '#10b981' },
    { name: 'REQUIRE APPROVAL', value: pendingApprovalsCount || 6, color: '#f59e0b' },
    { name: 'DENY', value: deniedRequestsCount || 5, color: '#f43f5e' },
  ];

  // Chart data 3: Risk distribution by agent
  const agentRiskData = agents.map((a) => ({
    name: a.name.split(' ')[0], // short name
    score: a.riskScore,
    requests: a.totalRequestsToday,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Dual-Color Styling */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
        style={{
          borderTop: `3px solid ${paletteInfo.primaryColor}`,
        }}
      >
        <div
          className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${paletteInfo.primaryColor}, ${paletteInfo.secondaryColor})` }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Security Governance Console
            </h1>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
              style={{
                backgroundColor: `${paletteInfo.primaryColor}15`,
                color: paletteInfo.primaryColor,
                borderColor: `${paletteInfo.primaryColor}30`,
              }}
            >
              CISO SCOPE • {paletteInfo.tag.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time context-aware authorization gateway monitoring {agents.length} personalized AI agents and {resources.length} enterprise data assets.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setIsPolicyOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Policy</span>
          </button>
          <button
            onClick={() => setIsRegisterOpen(true)}
            style={{
              background: `linear-gradient(135deg, ${paletteInfo.primaryColor}, ${paletteInfo.secondaryColor})`,
              boxShadow: `0 4px 12px -2px ${paletteInfo.primaryColor}40`,
            }}
            className="px-3.5 py-2 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 hover:opacity-95"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Register Agent</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Registered Agents"
          value={agents.length}
          subtext={`${activeAgentsCount} active at edge`}
          icon={Bot}
          variant="blue"
          onClick={() => navigate('/admin/agents')}
        />

        <MetricCard
          title="Requests Evaluated"
          value={totalVolumeToday.toLocaleString()}
          subtext="Processed in last 24h"
          icon={ArrowRightLeft}
          variant="navy"
          trend={{ value: '+14% vs yesterday', positive: true }}
          onClick={() => navigate('/admin/requests')}
        />

        <MetricCard
          title="Allowed Requests"
          value={allowedRequestsCount}
          subtext="Deterministic policy match"
          icon={ShieldCheck}
          variant="emerald"
          onClick={() => navigate('/admin/requests')}
        />

        <MetricCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          subtext="Dual-custody gate triggered"
          icon={Clock}
          variant="amber"
          onClick={() => navigate('/admin/approvals')}
        />
      </div>

      {/* Second Row of Cards: Denied, High Risk, Policies */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Blocked Violations"
          value={deniedRequestsCount}
          subtext="Prevented unauthorized access"
          icon={ShieldX}
          variant="rose"
          onClick={() => navigate('/admin/requests')}
        />

        <MetricCard
          title="High-Risk Agents"
          value={highRiskAgentsCount}
          subtext="Risk score > 60 ceiling"
          icon={ShieldAlert}
          variant="rose"
          onClick={() => navigate('/admin/risk')}
        />

        <MetricCard
          title="Active Edge Policies"
          value={policies.length}
          subtext="Zero-Trust rules in Cloudflare D1"
          icon={FileKey}
          variant="blue"
          onClick={() => navigate('/admin/policies')}
        />
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Volume Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Authorization Activity (Cloudflare Edge Telemetry)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time request evaluations categorized by outcome
              </p>
            </div>
            <span className="text-xs font-mono text-blue-700 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
              Mumbai (bom01)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApproval" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDenied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="allowed" name="ALLOW" stroke="#10b981" fillOpacity={1} fill="url(#colorAllowed)" strokeWidth={2} />
                <Area type="monotone" dataKey="approval" name="REQUIRE APPROVAL" stroke="#f59e0b" fillOpacity={1} fill="url(#colorApproval)" strokeWidth={2} />
                <Area type="monotone" dataKey="denied" name="DENY" stroke="#f43f5e" fillOpacity={1} fill="url(#colorDenied)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Decision Breakdown Donut */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Decision Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluation ratio across all agents
            </p>

            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={decisionChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {decisionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {decisionChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Edge Authorization Requests
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest AI Agent interactions evaluated by AgentAccess
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/requests')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Requests</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Agent & Owner</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Decision</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {requests.slice(0, 6).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {req.agentName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Owner: {req.ownerName}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <ActionBadge action={req.action} />
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {req.resourceName}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <DecisionBadge decision={req.decision} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge score={req.riskScore} level={req.riskLevel} />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {req.timestamp.split(' ')[1] || req.timestamp}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {req.approvalStatus === 'PENDING' ? (
                      <button
                        onClick={() => setSelectedPendingRequest(req)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-xs"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {req.approvalStatus === 'APPROVED' ? 'Approved' : 'Completed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <RegisterAgentModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
      <CreatePolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
      />
      <ApprovalActionModal
        request={selectedPendingRequest}
        isOpen={!!selectedPendingRequest}
        onClose={() => setSelectedPendingRequest(null)}
      />
    </div>
  );
};
