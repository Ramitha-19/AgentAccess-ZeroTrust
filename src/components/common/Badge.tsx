import React from 'react';
import { DecisionType, RiskLevel, ActionType, AgentStatus, ApprovalStatus } from '../../types';
import { ShieldCheck, ShieldAlert, ShieldX, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface DecisionBadgeProps {
  decision: DecisionType;
  size?: 'sm' | 'md' | 'lg';
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  }[size];

  switch (decision) {
    case 'ALLOW':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          ALLOW
        </span>
      );
    case 'REQUIRE_APPROVAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          REQUIRE APPROVAL
        </span>
      );
    case 'DENY':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 ${sizeClasses}`}
        >
          <ShieldX className="w-3.5 h-3.5" />
          DENY
        </span>
      );
    default:
      return null;
  }
};

interface RiskBadgeProps {
  score?: number;
  level?: RiskLevel;
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level, showScore = true }) => {
  const computedLevel: RiskLevel =
    level ||
    (score !== undefined
      ? score >= 85
        ? 'CRITICAL'
        : score >= 60
        ? 'HIGH'
        : score >= 30
        ? 'MEDIUM'
        : 'LOW'
      : 'LOW');

  switch (computedLevel) {
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Low Risk {showScore && score !== undefined ? `(${score})` : ''}
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          Medium {showScore && score !== undefined ? `(${score})` : ''}
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          High Risk {showScore && score !== undefined ? `(${score})` : ''}
        </span>
      );
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
          <ShieldAlert className="w-3 h-3 text-rose-500" />
          Critical {showScore && score !== undefined ? `(${score})` : ''}
        </span>
      );
  }
};

interface ActionBadgeProps {
  action: ActionType | '*';
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ action }) => {
  const styles: Record<string, string> = {
    READ: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    UPDATE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    EXPORT: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    DELETE: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    '*': 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border ${
        styles[action] || styles['*']
      }`}
    >
      {action}
    </span>
  );
};

interface StatusBadgeProps {
  status: AgentStatus | ApprovalStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ACTIVE':
    case 'Healthy':
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          {status === 'APPROVED' ? 'Approved' : status === 'ACTIVE' ? 'Active' : status}
        </span>
      );
    case 'PENDING':
    case 'REVIEW':
    case 'Maintenance':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3 text-amber-500" />
          {status === 'PENDING' ? 'Pending Approval' : status === 'REVIEW' ? 'Under Review' : status}
        </span>
      );
    case 'SUSPENDED':
    case 'REJECTED':
    case 'Locked':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <XCircle className="w-3 h-3 text-rose-500" />
          {status === 'REJECTED' ? 'Rejected' : status === 'SUSPENDED' ? 'Suspended' : status}
        </span>
      );
    case 'NOT_REQUIRED':
      return (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Not Required
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20">
          {status}
        </span>
      );
  }
};
