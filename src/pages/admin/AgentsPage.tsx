import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { Agent } from '../../types';
import { AgentCard } from '../../components/agent/AgentCard';
import { AgentDetailModal } from '../../components/agent/AgentDetailModal';
import { RegisterAgentModal } from '../../components/agent/RegisterAgentModal';
import { StatusBadge, RiskBadge, ActionBadge } from '../../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Plus,
  Search,
  Filter,
  User,
  Power,
  Shield,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const { agents, updateAgent } = useGateway();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'REVIEW'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Filtered agents
  const filteredAgents = agents.filter((ag) => {
    const matchesSearch =
      ag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ag.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInspect = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDetailOpen(true);
  };

  const handleSimulate = (agentId: string) => {
    navigate('/hr/simulator');
  };

  const handleToggleStatus = (ag: Agent) => {
    const nextStatus = ag.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateAgent(ag.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              AI Agent Registry
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {agents.length} AGENTS REGISTERED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Governs the cryptographic bindings, resource leases, and behavioral risk thresholds for all personalized AI agents.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register New AI Agent</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search agent name, employee owner, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended Only</option>
              <option value="REVIEW">Under Review</option>
            </select>
          </div>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-400'}`}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-400'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-3">Agent</th>
                <th className="py-3 px-3">Human Owner</th>
                <th className="py-3 px-3">Purpose</th>
                <th className="py-3 px-3">Risk Assessment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Activity</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ag.avatar}
                        alt={ag.ownerName}
                        className="w-8 h-8 rounded-lg object-cover border border-blue-200 dark:border-blue-800"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {ag.name}
                        </div>
                        <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                          {ag.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {ag.ownerName}
                    </div>
                    <div className="text-[10px] text-slate-400">{ag.department}</div>
                  </td>

                  <td className="py-3.5 px-3 max-w-xs">
                    <p className="line-clamp-2 text-slate-600 dark:text-slate-400">
                      {ag.purpose}
                    </p>
                  </td>

                  <td className="py-3.5 px-3">
                    <RiskBadge score={ag.riskScore} level={ag.riskLevel} />
                  </td>

                  <td className="py-3.5 px-3">
                    <StatusBadge status={ag.status} />
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {ag.lastActive}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {ag.totalRequestsToday} reqs today
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleInspect(ag)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleToggleStatus(ag)}
                        className={`p-1.5 rounded-lg border transition ${
                          ag.status === 'ACTIVE'
                            ? 'text-rose-500 border-rose-500/20 hover:bg-rose-500/10'
                            : 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10'
                        }`}
                        title={ag.status === 'ACTIVE' ? 'Suspend agent' : 'Activate agent'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((ag) => (
            <AgentCard
              key={ag.id}
              agent={ag}
              onInspect={handleInspect}
              onSimulate={handleSimulate}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AgentDetailModal
        agent={selectedAgent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSimulate={handleSimulate}
      />
      <RegisterAgentModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
};
