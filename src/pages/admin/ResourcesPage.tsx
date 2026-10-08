import React, { useState } from 'react';
import { useGateway } from '../../context/GatewayContext';
import { EnterpriseResource } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Database,
  Plus,
  Server,
  Layers,
  ShieldAlert,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { resources, agents, createResource } = useGateway();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<EnterpriseResource['type']>('Relational Database');
  const [sensitivity, setSensitivity] = useState<EnterpriseResource['sensitivity']>('High');
  const [description, setDescription] = useState('');
  const [recordCount, setRecordCount] = useState('10,000 records');
  const [location, setLocation] = useState('Cloudflare D1 • Mumbai Edge (bom01)');

  const filteredResources = resources.filter((res) => {
    return (
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getAgentNames = (agentIds: string[]) => {
    return agentIds.map((id) => {
      const ag = agents.find((a) => a.id === id);
      return ag ? ag.name : id;
    });
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createResource({
      name: name.trim(),
      code: code.trim() || `RES_${name.toUpperCase().replace(/\s+/g, '_')}`,
      type,
      sensitivity,
      description: description.trim() || 'Internal asset protected by AgentAccess.',
      allowedAgents: [],
      recordCount,
      status: 'Healthy',
      location,
    });

    setName('');
    setCode('');
    setDescription('');
    setIsAddOpen(false);
  };

  const getSensitivityBadge = (sens: EnterpriseResource['sensitivity']) => {
    const map = {
      Restricted: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      Confidential: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      High: 'bg-blue-800/10 text-blue-800 dark:text-blue-300 border-blue-800/30',
      Medium: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${map[sens]}`}>
        {sens}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Enterprise Data Resources
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {resources.length} MANAGED TARGETS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Databases, document stores, and API gateways shielded behind the AgentAccess zero-trust policy proxy.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Resource</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search resource name, classification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Resources Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <th className="py-3 px-3">Resource Name & Code</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Sensitivity Tier</th>
              <th className="py-3 px-3">Allowed AI Agents</th>
              <th className="py-3 px-3">Volume / Rows</th>
              <th className="py-3 px-3">Edge Placement</th>
              <th className="py-3 px-3">Health Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {filteredResources.map((res) => {
              const allowedAgentNames = getAgentNames(res.allowedAgents);
              return (
                <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {res.name}
                    </div>
                    <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                      {res.code}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 max-w-xs">
                      {res.description}
                    </p>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {res.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getSensitivityBadge(res.sensitivity)}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {allowedAgentNames.length === 0 ? (
                        <span className="text-slate-400 text-[11px] italic">
                          None provisioned (Universal deny)
                        </span>
                      ) : (
                        allowedAgentNames.map((agName, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {agName}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {res.recordCount}
                  </td>

                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {res.location}
                  </td>

                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={res.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Resource Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Enterprise Resource"
        subtitle="Bring a new database, API, or storage bucket under AgentAccess gateway governance"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateResource} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Resource Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Audit Archives 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asset Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Relational Database">Relational Database</option>
                <option value="Document Store">Document Store</option>
                <option value="Object Bucket">Object Bucket (Cloudflare R2)</option>
                <option value="API Gateway">API Gateway</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sensitivity Classification
              </label>
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="Confidential">Confidential</option>
                <option value="Restricted">Restricted</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Operational description of dataset..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
            >
              Register Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
