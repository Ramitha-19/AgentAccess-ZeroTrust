import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { useAuth } from '../../context/AuthContext';
import { ActionType, Agent, EnterpriseResource, EvaluationStep } from '../../types';
import { DecisionBadge, RiskBadge, ActionBadge } from '../common/Badge';
import {
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
  Shield,
  Sliders,
  ChevronRight,
  Database,
  ArrowRight,
  RefreshCw,
  FileText,
  User,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface AgentSimulatorProps {
  initialAgentId?: string;
  onSuccess?: () => void;
}

export const AgentSimulator: React.FC<AgentSimulatorProps> = ({ initialAgentId, onSuccess }) => {
  const { agents, resources, executeRequest, approveRequest } = useGateway();
  const { user, role } = useAuth();
  const { paletteInfo } = useTheme();
  const navigate = useNavigate();

  // Find selected agent
  const defaultAgent =
    agents.find((a) => (initialAgentId ? a.id === initialAgentId : a.id === 'agent-hr-01')) ||
    agents[0];

  const [selectedAgentId, setSelectedAgentId] = useState<string>(defaultAgent?.id || '');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('res-payroll');
  const [action, setAction] = useState<ActionType>('READ');
  const [purpose, setPurpose] = useState<string>('Generate monthly salary report for Q3 engineering cohort');

  // Context simulation toggles
  const [showAdvancedContext, setShowAdvancedContext] = useState(false);
  const [frequency, setFrequency] = useState<number>(4);
  const [networkType, setNetworkType] = useState<'Direct Zero Trust' | 'Corporate VPN' | 'Public Edge'>(
    'Direct Zero Trust'
  );
  const [timeContext, setTimeContext] = useState<string>('Business Hours (14:30 IST)');

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || defaultAgent;
  const selectedResource = resources.find((r) => r.id === selectedResourceId) || resources[0];

  // Quick preset scenarios
  const presets = [
    {
      label: 'Read Payroll (Salary Report)',
      action: 'READ' as ActionType,
      resourceId: 'res-payroll',
      purpose: 'Generate monthly salary report for Q3 engineering cohort',
      expected: 'ALLOW',
      riskExpected: '~18 Low',
    },
    {
      label: 'Export Payroll (Statutory Audit)',
      action: 'EXPORT' as ActionType,
      resourceId: 'res-payroll',
      purpose: 'Export executive compensation sheets for external statutory compliance audit',
      expected: 'REQUIRE APPROVAL',
      riskExpected: '~62 High',
    },
    {
      label: 'Delete Payroll (Intern Records)',
      action: 'DELETE' as ActionType,
      resourceId: 'res-payroll',
      purpose: 'Purge deprecated 2023 intern payout records',
      expected: 'DENY',
      riskExpected: '~94 Critical',
    },
    {
      label: 'Read Employee Records (Tenure)',
      action: 'READ' as ActionType,
      resourceId: 'res-emp-records',
      purpose: 'Lookup emergency contact and tenure for incoming performance reviews',
      expected: 'ALLOW',
      riskExpected: '~14 Low',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setAction(p.action);
    setSelectedResourceId(p.resourceId);
    setPurpose(p.purpose);
    setSimulationResult(null);
  };

  const handleRunSimulation = async () => {
    if (!selectedAgent || !selectedResource) return;

    setIsSimulating(true);
    setSimulationResult(null);
    setActiveStepIndex(0);

    // Simulate animated step-by-step pipeline
    await new Promise((r) => setTimeout(r, 350));
    setActiveStepIndex(1); // Context evaluation
    await new Promise((r) => setTimeout(r, 400));
    setActiveStepIndex(2); // Policy check
    await new Promise((r) => setTimeout(r, 450));
    setActiveStepIndex(3); // Risk scoring
    await new Promise((r) => setTimeout(r, 400));
    setActiveStepIndex(4); // Decision gate

    // Execute through deterministic Gateway engine
    const result = executeRequest({
      agent: selectedAgent,
      resource: selectedResource,
      action,
      purpose,
      context: {
        frequencyPerMin: frequency,
        networkType,
        timeOfDay: timeContext,
        ip: networkType === 'Public Edge' ? '115.112.89.4' : '103.21.244.18',
        location: networkType === 'Public Edge' ? 'Pune, India' : 'Bengaluru, India',
      },
    });

    setSimulationResult(result);
    setIsSimulating(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Presets with Dual-Color Styling */}
      <div
        className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-700/80 shadow-md relative overflow-hidden"
        style={{
          borderTop: `2px solid ${paletteInfo.primaryColor}`,
        }}
      >
        <div
          className="absolute -right-10 -top-10 w-44 h-44 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${paletteInfo.primaryColor}, ${paletteInfo.secondaryColor})` }}
        />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="p-1 rounded-md"
                style={{ backgroundColor: `${paletteInfo.primaryColor}25`, color: paletteInfo.primaryColor }}
              >
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span>Interactive Authorization Simulator</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border" style={{ borderColor: `${paletteInfo.secondaryColor}40`, color: paletteInfo.secondaryColor }}>
                  {paletteInfo.tag}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Select an action and resource for <strong>{selectedAgent?.name}</strong> to observe real-time deterministic context evaluation, policy matching, and risk scoring.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Presets:
            </span>
            {presets.map((p, idx) => {
              const isSelected = action === p.action && selectedResourceId === p.resourceId;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  style={isSelected ? {
                    background: `linear-gradient(135deg, ${paletteInfo.primaryColor}, ${paletteInfo.secondaryColor})`,
                    color: '#ffffff',
                    boxShadow: `0 2px 10px -2px ${paletteInfo.primaryColor}50`,
                  } : undefined}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
                    isSelected
                      ? 'font-bold border-transparent'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {p.action} {p.resourceId === 'res-payroll' ? 'Payroll' : 'Records'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Request Configuration Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Request Parameters
            </h4>

            {/* Agent Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                AI Agent Identity
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                disabled={isSimulating}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} (Owner: {ag.ownerName} • {ag.department})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Bound to human employee: <strong>{selectedAgent?.ownerName}</strong>
              </p>
            </div>

            {/* Resource Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Enterprise Resource
              </label>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                disabled={isSimulating}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {resources.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name} [{res.sensitivity} Sensitivity • {res.type}]
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Requested Action
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['READ', 'UPDATE', 'EXPORT', 'DELETE'] as ActionType[]).map((act) => {
                  const isSelected = action === act;
                  const colorMap = {
                    READ: 'hover:border-blue-500',
                    UPDATE: 'hover:border-amber-500',
                    EXPORT: 'hover:border-purple-500',
                    DELETE: 'hover:border-rose-500',
                  };
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setAction(act)}
                      disabled={isSimulating}
                      className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition ${
                        isSelected
                          ? act === 'READ'
                            ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                            : act === 'UPDATE'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : act === 'EXPORT'
                            ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                            : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                          : `bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ${colorMap[act]}`
                      }`}
                    >
                      {act}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purpose Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Operational Purpose / Context
              </label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Specify the task justification..."
                disabled={isSimulating}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Advanced Context Knobs Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedContext(!showAdvancedContext)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>{showAdvancedContext ? 'Hide' : 'Show'} Context Anomaly Knobs</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transform transition-transform ${
                    showAdvancedContext ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {showAdvancedContext && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      <span>Request Velocity:</span>
                      <span className="font-mono">{frequency} req/min</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={45}
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Network Pathway:
                    </label>
                    <select
                      value={networkType}
                      onChange={(e) => setNetworkType(e.target.value as any)}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Direct Zero Trust">Direct Zero Trust (Trusted mTLS)</option>
                      <option value="Corporate VPN">Corporate VPN (Verified)</option>
                      <option value="Public Edge">Public Edge (Untrusted IP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Time Context:
                    </label>
                    <select
                      value={timeContext}
                      onChange={(e) => setTimeContext(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Business Hours (14:30 IST)">Business Hours (14:30 IST)</option>
                      <option value="After Hours (23:45 IST)">After Hours (23:45 IST)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button with Dual-Color Styling */}
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              style={{
                background: `linear-gradient(135deg, ${paletteInfo.primaryColor}, ${paletteInfo.secondaryColor})`,
                boxShadow: `0 4px 14px -3px ${paletteInfo.primaryColor}50`,
              }}
              className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer hover:opacity-95"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating at Cloudflare Edge...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Simulate AgentAccess Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 5-Stage Authorization Pipeline & Result */}
        <div className="lg:col-span-7 space-y-4">
          {/* Pipeline Stage Visualizer */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-between">
              <span>Authorization Pipeline Steps</span>
              {isSimulating && (
                <span className="text-blue-600 font-mono text-[11px] animate-pulse">
                  Step {activeStepIndex + 1} of 5 in progress...
                </span>
              )}
            </h4>

            {/* Step Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {[
                { label: '1. Identity', desc: 'Agent & Owner' },
                { label: '2. Context', desc: 'IP & Velocity' },
                { label: '3. Policy', desc: 'D1 Matrix' },
                { label: '4. Risk', desc: 'Deterministic' },
                { label: '5. Decision', desc: 'Gate Check' },
              ].map((step, idx) => {
                const isCompleted = activeStepIndex > idx || (simulationResult && !isSimulating);
                const isCurrent = activeStepIndex === idx && isSimulating;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      isCompleted
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : isCurrent
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 ring-2 ring-blue-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{step.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{step.desc}</div>
                    <div className="mt-2 flex justify-center">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Card */}
          {simulationResult ? (
            <div
              className={`p-5 rounded-2xl border transition-all shadow-md ${
                simulationResult.decision === 'ALLOW'
                  ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/15'
                  : simulationResult.decision === 'REQUIRE_APPROVAL'
                  ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/15'
                  : 'border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Evaluated Decision:
                    </span>
                    <DecisionBadge decision={simulationResult.decision} size="lg" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                    {simulationResult.reason}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Risk Assessment
                  </div>
                  <div className="mt-1">
                    <RiskBadge score={simulationResult.riskScore} level={simulationResult.riskLevel} />
                  </div>
                </div>
              </div>

              {/* Breakdown details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Policy & Context Card */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    Policy Context
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Matched Policy:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                      {simulationResult.matchedPolicy?.name || 'Least Privilege Fallback'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Target Resource:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedResource.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Request ID:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {simulationResult.request.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Audit Trail Hash:</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {simulationResult.auditLog.hash}
                    </span>
                  </div>
                </div>

                {/* Risk Factors Breakdown */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-700" />
                    Risk Score Factors ({simulationResult.riskScore}/100)
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {simulationResult.riskFactors.map((rf: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-[11px] p-1 rounded bg-slate-50 dark:bg-slate-950/60"
                      >
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[170px]" title={rf.explanation}>
                          {rf.factor}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            rf.points > 20
                              ? 'text-rose-500'
                              : rf.points > 0
                              ? 'text-amber-500'
                              : 'text-emerald-500'
                          }`}
                        >
                          {rf.points > 0 ? `+${rf.points}` : rf.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons for REQUIRE_APPROVAL */}
              {simulationResult.decision === 'REQUIRE_APPROVAL' && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
                    <span>
                      This request has entered the <strong>Human Approval Queue</strong>.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        approveRequest(
                          simulationResult.request.id,
                          user ? user.name : 'Authorized Supervisor',
                          'Approved immediately in interactive simulation'
                        );
                        setSimulationResult({
                          ...simulationResult,
                          decision: 'ALLOW',
                          reason: 'Human supervisor approved the high-risk request.',
                        });
                      }}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                    >
                      Approve as Reviewer
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(role === 'ADMIN' ? '/admin/approvals' : '/hr/approvals')}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 text-xs font-semibold transition"
                    >
                      Open Queue
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Ready to Evaluate Agent Request
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Configure the request parameters on the left or click one of the quick presets above to test how AgentAccess governs autonomous AI actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
