import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGateway } from '../../context/GatewayContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Bot,
  FileKey,
  ShieldAlert,
  CheckSquare,
  History,
  Database,
  Settings,
  Sparkles,
  ArrowRightLeft,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SidebarLink {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const { requests } = useGateway();
  const { paletteInfo } = useTheme();

  const pendingApprovalsCount = requests.filter((r) => r.approvalStatus === 'PENDING').length;
  const priyaPendingCount = requests.filter(
    (r) => r.agentId === 'agent-hr-01' && r.approvalStatus === 'PENDING'
  ).length;

  const adminLinks: SidebarLink[] = [
    { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { name: 'AI Agents', to: '/admin/agents', icon: Bot },
    { name: 'Access Requests', to: '/admin/requests', icon: ArrowRightLeft },
    { name: 'Policies', to: '/admin/policies', icon: FileKey },
    { name: 'Risk Monitoring', to: '/admin/risk', icon: ShieldAlert },
    {
      name: 'Approvals',
      to: '/admin/approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { name: 'Audit Logs', to: '/admin/audit', icon: History },
    { name: 'Resources', to: '/admin/resources', icon: Database },
    { name: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const hrLinks: SidebarLink[] = [
    { name: 'HR Dashboard', to: '/hr', icon: LayoutDashboard },
    { name: 'Use My AI Agent', to: '/hr/simulator', icon: Sparkles, highlight: true },
    { name: 'My AI Agents', to: '/hr/agents', icon: Bot },
    {
      name: 'Pending Approvals',
      to: '/hr/approvals',
      icon: CheckSquare,
      badge: priyaPendingCount > 0 ? priyaPendingCount : undefined,
    },
    { name: 'Audit History', to: '/hr/audit', icon: History },
  ];

  const links = role === 'ADMIN' ? adminLinks : hrLinks;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Role Identity Card */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Scope
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                role === 'ADMIN'
                  ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              }`}
            >
              {role === 'ADMIN' ? 'SYS_ADMIN' : 'PEOPLE_OPS'}
            </span>
          </div>
          <p className="mt-1.5 text-xs font-semibold text-slate-900 dark:text-white truncate">
            {role === 'ADMIN' ? 'Security & Governance Control' : 'Priya Sharma (HR Manager)'}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/hr'}
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor: `${paletteInfo.primaryColor}15`,
                        borderColor: `${paletteInfo.primaryColor}35`,
                        color: paletteInfo.primaryColor,
                      }
                    : link.highlight
                    ? {
                        borderColor: `${paletteInfo.secondaryColor}30`,
                        backgroundColor: `${paletteInfo.secondaryColor}10`,
                      }
                    : undefined
                }
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 border border-transparent ${
                    isActive
                      ? 'font-bold shadow-xs'
                      : link.highlight
                      ? 'text-slate-800 dark:text-slate-200 hover:opacity-90'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      link.highlight ? 'animate-pulse' : ''
                    }`}
                  />
                  <span>{link.name}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Zero Trust Footer Notice */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Agent Governance</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Human authorization does <strong>not</strong> grant unlimited AI authorization.
          </p>
        </div>
      </div>
    </aside>
  );
};
