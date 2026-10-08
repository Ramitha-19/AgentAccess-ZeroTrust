import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { AccessRequest, DecisionType, RiskLevel } from '../../types';
import { DecisionBadge, RiskBadge, ActionBadge, StatusBadge } from '../../components/common/Badge';
import { ApprovalActionModal } from '../../components/approval/ApprovalActionModal';
import { Modal } from '../../components/common/Modal';
import {
  ArrowRightLeft,
  Filter,
  Search,
  SlidersHorizontal,
  FileText,
  Clock,
  Shield,
  Layers,
  X,
  User,
  Zap,
} from 'lucide-react';

export const AccessRequestsPage: React.FC = () => {
  const { requests, agents, resources } = useGateway();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | DecisionType>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [resourceFilter, setResourceFilter] = useState<string>('ALL');

  // Inspection & Approval Modals
  const [inspectRequest, setInspectRequest] = useState<AccessRequest | null>(null);
  const [reviewRequest, setReviewRequest] = useState<AccessRequest | null>(null);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDecision = decisionFilter === 'ALL' || req.decision === decisionFilter;
    const matchesRisk = riskFilter === 'ALL' || req.riskLevel === riskFilter;
    const matchesAgent = agentFilter === 'ALL' || req.agentId === agentFilter;
    const matchesResource = resourceFilter === 'ALL' || req.resourceId === resourceFilter;

    return matchesSearch && matchesDecision && matchesRisk && matchesAgent && matchesResource;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setDecisionFilter('ALL');
    setRiskFilter('ALL');
    setAgentFilter('ALL');
    setResourceFilter('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Access Requests Log
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {requests.length} EVALUATED TRANSACTIONS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every autonomous AI agent transaction inspected against deterministic policies, real-time risk scores, and context anomalies.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, Agent, Resource, or purpose justification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick Clear */}
          {(decisionFilter !== 'ALL' || riskFilter !== 'ALL' || agentFilter !== 'ALL' || resourceFilter !== 'ALL' || searchTerm) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold flex items-center justify-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Decision
            </label>
            <select
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Decisions</option>
              <option value="ALLOW">ALLOW</option>
              <option value="REQUIRE_APPROVAL">REQUIRE APPROVAL</option>
              <option value="DENY">DENY</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Risk Severity
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low (0-29)</option>
              <option value="MEDIUM">Medium (30-59)</option>
              <option value="HIGH">High (60-84)</option>
              <option value="CRITICAL">Critical (85+)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Agent Identity
            </label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Agents</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Enterprise Resource
            </label>
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Resources</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-3">Request ID</th>
              <th className="py-3 px-3">Agent & Human Owner</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Target Resource</th>
              <th className="py-3 px-3">Purpose / Justification</th>
              <th className="py-3 px-3">Risk Assessment</th>
              <th className="py-3 px-3">Decision</th>
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No access requests matching current filter criteria.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                    {req.id}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {req.agentName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-600" />
                      <span>{req.ownerName}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <ActionBadge action={req.action} />
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {req.resourceName}
                    </span>
                  </td>

                  <td className="py-3 px-3 max-w-xs">
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-[11px]" title={req.purpose}>
                      {req.purpose}
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    <RiskBadge score={req.riskScore} level={req.riskLevel} />
                  </td>

                  <td className="py-3 px-3">
                    <DecisionBadge decision={req.decision} size="sm" />
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {req.timestamp}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setInspectRequest(req)}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition"
                      >
                        Inspect
                      </button>
                      {req.approvalStatus === 'PENDING' && (
                        <button
                          onClick={() => setReviewRequest(req)}
                          className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-xs"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Request Modal */}
      {inspectRequest && (
        <Modal
          isOpen={!!inspectRequest}
          onClose={() => setInspectRequest(null)}
          title={`Request Details • ${inspectRequest.id}`}
          subtitle={`Evaluated at ${inspectRequest.timestamp}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Decision Outcome
                </span>
                <div className="mt-1">
                  <DecisionBadge decision={inspectRequest.decision} size="lg" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Calculated Risk
                </span>
                <div className="mt-1">
                  <RiskBadge score={inspectRequest.riskScore} level={inspectRequest.riskLevel} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">AI Agent:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inspectRequest.agentName}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Human Owner:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inspectRequest.ownerName}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Resource:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {inspectRequest.resourceName}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Action:</span>
                <ActionBadge action={inspectRequest.action} />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1">Purpose / Context:</span>
              <p className="text-slate-800 dark:text-slate-200">{inspectRequest.purpose}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                Context Signals
              </span>
              <div className="flex justify-between text-slate-500">
                <span>Origin IP:</span>
                <span className="font-mono">{inspectRequest.context.ip} ({inspectRequest.context.location})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Network Route:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{inspectRequest.context.networkType}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Velocity:</span>
                <span className="font-mono">{inspectRequest.context.frequencyPerMin} req/min</span>
              </div>
            </div>

            {inspectRequest.riskFactors && inspectRequest.riskFactors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Risk Factors
                </span>
                {inspectRequest.riskFactors.map((rf, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-50 dark:bg-slate-950 text-xs flex justify-between items-center"
                  >
                    <span className="text-slate-600 dark:text-slate-400">{rf.factor}</span>
                    <span className="font-mono font-bold text-amber-500">+{rf.points} pts</span>
                  </div>
                ))}
              </div>
            )}

            {inspectRequest.approvalDetails && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Human Approval History
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  Reviewed by {inspectRequest.approvalDetails.reviewedBy} at {inspectRequest.approvalDetails.reviewedAt}
                </p>
                <p className="text-slate-500 mt-1 italic">
                  Note: "{inspectRequest.approvalDetails.note}"
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectRequest(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Review Modal */}
      <ApprovalActionModal
        request={reviewRequest}
        isOpen={!!reviewRequest}
        onClose={() => setReviewRequest(null)}
      />
    </div>
  );
};
