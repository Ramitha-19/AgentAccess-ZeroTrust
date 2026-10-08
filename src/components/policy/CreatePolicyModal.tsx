import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useGateway } from '../../context/GatewayContext';
import { ActionType, DecisionType } from '../../types';
import { FileKey, Shield, AlertTriangle } from 'lucide-react';

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreatePolicyModal: React.FC<CreatePolicyModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { agents, resources, createPolicy } = useGateway();

  const [name, setName] = useState('');
  const [agentId, setAgentId] = useState('*');
  const [resourceId, setResourceId] = useState('*');
  const [action, setAction] = useState<ActionType | '*'>('READ');
  const [decision, setDecision] = useState<DecisionType>('ALLOW');
  const [maxRiskScore, setMaxRiskScore] = useState<number>(45);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createPolicy({
      name: name.trim(),
      agentId,
      resourceId,
      action,
      decision,
      maxRiskScore,
      requiresPurpose: true,
      active: true,
      description: description.trim() || `Ruleset governing ${action} requests for ${agentId}.`,
    });

    onClose();
    if (onCreated) onCreated();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Authorization Policy"
      subtitle="Define deterministic edge rules matching agent, resource, and action tuples"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Policy Rule Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., HR Agent Sensitive Payout Update Gate"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target AI Agent
            </label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="*">* Universal (All AI Agents)</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.ownerName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Enterprise Resource
            </label>
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="*">* Universal (All Resources)</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name} ({res.sensitivity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Action Classification
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="READ">READ (Non-mutating)</option>
              <option value="UPDATE">UPDATE (Record modification)</option>
              <option value="EXPORT">EXPORT (Bulk exfiltration)</option>
              <option value="DELETE">DELETE (Destructive purge)</option>
              <option value="*">* Any Action</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deterministic Decision
            </label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="ALLOW" className="text-emerald-500">ALLOW</option>
              <option value="REQUIRE_APPROVAL" className="text-amber-500">REQUIRE APPROVAL</option>
              <option value="DENY" className="text-rose-500">DENY</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <span>Risk Score Safety Ceiling</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
              Max {maxRiskScore} / 100
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={95}
            value={maxRiskScore}
            onChange={(e) => setMaxRiskScore(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <p className="text-[11px] text-slate-400 mt-0.5">
            Requests scoring above {maxRiskScore} will automatically be elevated to Human Approval.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Policy Description / Statutory Basis
          </label>
          <textarea
            rows={2}
            placeholder="Explain compliance or business logic justification..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
          >
            Deploy Policy to Edge
          </button>
        </div>
      </form>
    </Modal>
  );
};
