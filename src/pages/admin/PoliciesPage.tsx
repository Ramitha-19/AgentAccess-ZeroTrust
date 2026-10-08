import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { AuthorizationPolicy, DecisionType } from '../../types';
import { DecisionBadge, ActionBadge } from '../../components/common/Badge';
import { CreatePolicyModal } from '../../components/policy/CreatePolicyModal';
import {
  FileKey,
  Plus,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Sliders,
  ShieldAlert,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const { policies, agents, resources, updatePolicy, deletePolicy } = useGateway();

  const [searchTerm, setSearchTerm] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | DecisionType>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDecision = decisionFilter === 'ALL' || p.decision === decisionFilter;
    return matchesSearch && matchesDecision;
  });

  const getAgentLabel = (agentId: string) => {
    if (agentId === '*') return 'Universal (* Any Agent)';
    const found = agents.find((a) => a.id === agentId);
    return found ? found.name : agentId;
  };

  const getResourceLabel = (resId: string) => {
    if (resId === '*') return 'Universal (* Any Resource)';
    const found = resources.find((r) => r.id === resId);
    return found ? found.name : resId;
  };

  const togglePolicyActive = (pol: AuthorizationPolicy) => {
    updatePolicy(pol.id, { active: !pol.active });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Deterministic Authorization Policies
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {policies.length} RULES IN EDGE D1
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Rules evaluated in strict deterministic sequence before AI agent requests reach target enterprise databases.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Policy Rule</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search policy name or rationale..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Decision Filter:</span>
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Outcomes</option>
            <option value="ALLOW">ALLOW</option>
            <option value="REQUIRE_APPROVAL">REQUIRE APPROVAL</option>
            <option value="DENY">DENY</option>
          </select>
        </div>
      </div>

      {/* Policy Rules Cards / Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-3">Policy Rule</th>
              <th className="py-3 px-3">Agent Identity</th>
              <th className="py-3 px-3">Enterprise Asset</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Decision</th>
              <th className="py-3 px-3">Risk Ceiling</th>
              <th className="py-3 px-3">State</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {filteredPolicies.map((pol) => (
              <tr key={pol.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-3 max-w-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {pol.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {pol.description}
                  </div>
                </td>

                <td className="py-3.5 px-3">
                  <span className={`font-semibold ${pol.agentId === '*' ? 'text-indigo-600 dark:text-indigo-400 font-mono' : 'text-slate-800 dark:text-slate-200'}`}>
                    {getAgentLabel(pol.agentId)}
                  </span>
                </td>

                <td className="py-3.5 px-3">
                  <span className={`font-medium ${pol.resourceId === '*' ? 'text-indigo-600 dark:text-indigo-400 font-mono' : 'text-slate-800 dark:text-slate-200'}`}>
                    {getResourceLabel(pol.resourceId)}
                  </span>
                </td>

                <td className="py-3.5 px-3">
                  <ActionBadge action={pol.action} />
                </td>

                <td className="py-3.5 px-3">
                  <DecisionBadge decision={pol.decision} size="sm" />
                </td>

                <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  Max {pol.maxRiskScore}/100
                </td>

                <td className="py-3.5 px-3">
                  <button
                    onClick={() => togglePolicyActive(pol)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition ${
                      pol.active
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${pol.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {pol.active ? 'Active' : 'Disabled'}
                  </button>
                </td>

                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => deletePolicy(pol.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                    title="Delete Policy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreatePolicyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};
