import React from 'react';
import { useGateway } from '../../context/GatewayContext';
import { MetricCard } from '../../components/common/MetricCard';
import { RiskBadge, StatusBadge } from '../../components/common/Badge';
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  Zap,
  TrendingUp,
  Cpu,
  User,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const RiskMonitoringPage: React.FC = () => {
  const { agents, requests } = useGateway();
  const navigate = useNavigate();

  const highRiskAgents = agents.filter((a) => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL');
  const avgRiskScore = Math.round(
    agents.reduce((acc, a) => acc + a.riskScore, 0) / (agents.length || 1)
  );

  // Suspicious requests (riskScore > 65 or DENY)
  const suspiciousRequests = requests.filter((r) => r.riskScore >= 65 || r.decision === 'DENY');

  // Chart data: Agent risk comparison
  const agentScoreData = agents.map((a) => ({
    name: a.name.replace(' Agent', ''),
    fullName: a.name,
    score: a.riskScore,
    level: a.riskLevel,
    requests: a.totalRequestsToday,
  }));

  // Velocity telemetry over time
  const velocityData = [
    { time: '14:00', priya: 4, rahul: 18, arjun: 2, sneha: 6 },
    { time: '15:00', priya: 6, rahul: 24, arjun: 5, sneha: 10 },
    { time: '16:00', priya: 8, rahul: 35, arjun: 22, sneha: 14 },
    { time: '17:00', priya: 12, rahul: 28, arjun: 4, sneha: 8 },
    { time: '18:00', priya: 3, rahul: 15, arjun: 2, sneha: 5 },
    { time: '19:00', priya: 2, rahul: 8, arjun: 1, sneha: 3 },
    { time: '20:00', priya: 4, rahul: 18, arjun: 3, sneha: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            AI Agent Behavioral Risk Monitoring
          </h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            DURABLE OBJECTS TELEMETRY
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Dynamic real-time anomaly detection calculating instantaneous request velocity, data sensitivity, and exfiltration vectors.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Fleet Avg Risk"
          value={`${avgRiskScore}/100`}
          subtext="Normalized behavioral baseline"
          icon={Activity}
          variant="blue"
        />

        <MetricCard
          title="High-Risk Agents"
          value={highRiskAgents.length}
          subtext="Exceeding 60-point ceiling"
          icon={ShieldAlert}
          variant="rose"
        />

        <MetricCard
          title="Anomalies Flagged"
          value={suspiciousRequests.length}
          subtext="Unusual velocity or payload"
          icon={AlertTriangle}
          variant="amber"
        />

        <MetricCard
          title="Cloudflare Edge Nodes"
          value="330+ PoPs"
          subtext="Sub-5ms deterministic scoring"
          icon={Zap}
          variant="navy"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Risk Bar Chart */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            AI Agent Risk Score Comparison (0 - 100)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current deterministic risk rating per registered employee agent
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {agentScoreData.map((entry, index) => {
                    const color =
                      entry.score >= 70 ? '#f43f5e' : entry.score >= 40 ? '#f59e0b' : '#10b981';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Velocity Over Time */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Request Velocity Telemetry (req/min)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time query velocity tracked by Cloudflare Durable Objects
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="priya" name="Priya HR" stroke="#06b6d4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rahul" name="Rahul Finance" stroke="#f43f5e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="arjun" name="Arjun Dev" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sneha" name="Sneha Support" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Suspicious Activity & High Risk Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* High Risk Agents Detail */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            High-Risk Agent Watchlist
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Agents with heightened anomaly rates or sensitive resource permissions
          </p>

          <div className="space-y-3 pt-1">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ag.avatar}
                    alt={ag.name}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                      {ag.name}
                    </h5>
                    <span className="text-[10px] text-slate-400">Owner: {ag.ownerName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <RiskBadge score={ag.riskScore} level={ag.riskLevel} />
                  <div className="text-[10px] text-slate-400 mt-1">
                    {ag.totalRequestsToday} reqs today
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suspicious Requests Feed */}
        <div className="lg:col-span-7 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Anomalous Edge Interceptions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Autonomous agent transactions that triggered approval gates or policy blocks
          </p>

          <div className="space-y-2.5 pt-1">
            {suspiciousRequests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {req.agentName}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {req.action} {req.resourceName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
                    {req.purpose}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <RiskBadge score={req.riskScore} level={req.riskLevel} />
                  <span className="font-mono text-[10px] text-slate-400">{req.timestamp.split(' ')[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
