import React from 'react';
import { Modal } from '../common/Modal';
import { Cloud, Database, Cpu, ShieldCheck, Zap, Server, Lock, Layers } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const stack = [
    {
      title: 'Cloudflare Worker',
      badge: 'Core Gateway Proxy',
      icon: Zap,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      description:
        'Serves as the high-throughput authorization gateway proxy. Intercepts all AI Agent tool-use and SQL queries with sub-5ms cold starts across 330+ edge PoPs.',
    },
    {
      title: 'Cloudflare D1',
      badge: 'Distributed Edge SQL',
      icon: Database,
      color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
      description:
        'Stores registered AI agent profiles, deterministic authorization policy rules, access requests, and immutable audit trails in edge-replicated SQLite.',
    },
    {
      title: 'Cloudflare Durable Objects',
      badge: 'Per-Agent State Machine',
      icon: Cpu,
      color: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      description:
        'Maintains strongly consistent, in-memory state for each AI agent (e.g. cf-durable-agent-priya-hr-01), tracking instantaneous request velocity, session anomalies, and active leases.',
    },
    {
      title: 'Cloudflare R2',
      badge: 'Zero-Egress Object Bucket',
      icon: Server,
      color: 'text-blue-800 bg-blue-100/60 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
      description:
        'Stores sensitive HR policy handbooks, compliance dossiers, and temporary audit export dumps with encrypted zero-egress fee retrieval.',
    },
    {
      title: 'Cloudflare Zero Trust & Access',
      badge: 'Identity-Aware Perimeter',
      icon: Lock,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description:
        'Enforces mTLS and employee SSO identity context (e.g., Priya Sharma login token) while validating that agent tokens cannot exceed employee scopes.',
    },
    {
      title: 'Cloudflare WAF & Rate Limiting',
      badge: 'Edge Threat Defense',
      icon: ShieldCheck,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      description:
        'Blocks prompt injection attempts, anomalous bot traffic, and agent loop amplification attacks before hitting internal microservices.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cloudflare Edge Gateway Architecture"
      subtitle="Enterprise Zero Trust Blueprint for AgentAccess Gateway"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Core Principle Callout */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
            <Layers className="w-4 h-4 text-blue-600" />
            Core Zero-Trust Principle
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            <strong>Human authorization does NOT automatically grant AI agent authorization.</strong>{' '}
            Every action executed by a personalized agent is evaluated at the Cloudflare Edge against identity bindings, action classification, resource sensitivity, context anomalies, and human-in-the-loop policies.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stack.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {item.badge}
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* API Pipeline Flow Diagram */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Deterministic Decision Pipeline (Worker Execution)
          </h4>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              1. Agent Token + mTLS
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              2. DO Velocity Check
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              3. D1 Policy Match
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              4. Deterministic Risk
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2.5 py-1.5 rounded bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold">
              ALLOW / APPROVE / DENY
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition"
          >
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </Modal>
  );
};
