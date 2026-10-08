import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useGateway } from '../../context/GatewayContext';
import { ActionType, RiskLevel } from '../../types';
import { Bot, User, Shield, Check } from 'lucide-react';

interface RegisterAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (agentId: string) => void;
}

export const RegisterAgentModal: React.FC<RegisterAgentModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { resources, registerAgent } = useGateway();

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('Priya Sharma');
  const [ownerEmail, setOwnerEmail] = useState('priya@agentaccess.demo');
  const [department, setDepartment] = useState('People Operations');
  const [purpose, setPurpose] = useState('');
  const [selectedResources, setSelectedResources] = useState<string[]>(['res-payroll', 'res-emp-records']);
  const [allowedActions, setAllowedActions] = useState<ActionType[]>(['READ']);
  const [restrictedActions, setRestrictedActions] = useState<ActionType[]>(['EXPORT', 'DELETE']);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('LOW');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !purpose.trim()) return;

    const newAgent = registerAgent({
      name: name.trim(),
      ownerName: ownerName.trim(),
      ownerEmail: ownerEmail.trim(),
      department,
      purpose: purpose.trim(),
      status: 'ACTIVE',
      riskLevel,
      riskScore: riskLevel === 'LOW' ? 18 : riskLevel === 'MEDIUM' ? 45 : 75,
      allowedResources: selectedResources,
      allowedActions,
      restrictedActions,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    onClose();
    if (onCreated) onCreated(newAgent.id);
  };

  const toggleResource = (resId: string) => {
    setSelectedResources((prev) =>
      prev.includes(resId) ? prev.filter((id) => id !== resId) : [...prev, resId]
    );
  };

  const toggleAllowedAction = (act: ActionType) => {
    setAllowedActions((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New AI Agent"
      subtitle="Provision a personalized AI agent bound to a human employee identity"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Priya HR Copilot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Human Owner Name *
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Owner Email *
            </label>
            <input
              type="email"
              required
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="People Operations">People Operations (HR)</option>
              <option value="Corporate Finance">Corporate Finance</option>
              <option value="Core Platform Engineering">Engineering</option>
              <option value="Customer Experience">Customer Support</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Mandated Autonomous Purpose *
          </label>
          <textarea
            rows={2}
            required
            placeholder="Explain the specific task boundary and operational charter of this agent..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Resources checkboxes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Allowed Enterprise Resources
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {resources.map((res) => {
              const isChecked = selectedResources.includes(res.id);
              return (
                <div
                  key={res.id}
                  onClick={() => toggleResource(res.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="font-medium truncate max-w-[170px]">{res.name}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Allowed Actions */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Permitted Actions (Least Privilege)
          </label>
          <div className="flex gap-2">
            {(['READ', 'UPDATE', 'EXPORT', 'DELETE'] as ActionType[]).map((act) => {
              const isChecked = allowedActions.includes(act);
              return (
                <button
                  type="button"
                  key={act}
                  onClick={() => toggleAllowedAction(act)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                    isChecked
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {act}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
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
            Register Agent & Provision Key
          </button>
        </div>
      </form>
    </Modal>
  );
};
