import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGateway } from '../../context/GatewayContext';
import { useTheme, DUAL_PALETTES, DualPalette } from '../../context/ThemeContext';
import {
  Shield,
  Bell,
  Sun,
  Moon,
  LogOut,
  Layers,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ChevronDown,
  UserCheck,
  RefreshCw,
  Palette,
  Check,
  Sparkles,
} from 'lucide-react';
import { ArchitectureModal } from './ArchitectureModal';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, resetDemoData } = useGateway();
  const { theme, toggleTheme, palette, setPalette, paletteInfo } = useTheme();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setIsPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleToggle = () => {
    if (role === 'ADMIN') {
      switchRole('HR_USER');
      navigate('/hr');
    } else {
      switchRole('ADMIN');
      navigate('/admin');
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'APPROVAL':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'VIOLATION':
      case 'ALERT':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand & Status */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => navigate(role === 'ADMIN' ? '/admin' : '/hr')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-sm text-white group-hover:bg-blue-700 transition">
                <Shield className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white">
                    Agent<span className="text-blue-600 dark:text-blue-400">Access</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    GATEWAY v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Context-Aware Authorization Gateway for AI Agents
                </p>
              </div>
            </div>

            {/* Edge Node Pill */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Edge: bom01 (Mumbai)</span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">Zero Trust mTLS</span>
            </div>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dual-Color Palette Picker Dropdown */}
            <div className="relative" ref={paletteRef}>
              <button
                onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                title="Change Blue Theme Palette"
              >
                <span className="flex items-center -space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 shadow-xs" style={{ backgroundColor: paletteInfo.primaryColor }} />
                  <span className="w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 shadow-xs" style={{ backgroundColor: paletteInfo.secondaryColor }} />
                </span>
                <span className="hidden sm:inline text-[11px] font-medium">{paletteInfo.primaryName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPaletteOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
                  <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      White & Blue Themes
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Presets</span>
                  </div>
                  <div className="space-y-1">
                    {Object.values(DUAL_PALETTES).map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() => {
                          setPalette(pal.id);
                          setIsPaletteOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                          palette === pal.id
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center -space-x-1.5">
                            <span className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-900 shadow-xs" style={{ backgroundColor: pal.primaryColor }} />
                            <span className="w-3.5 h-3.5 rounded-full border border-white dark:border-slate-900 shadow-xs" style={{ backgroundColor: pal.secondaryColor }} />
                          </div>
                          <div className="text-left">
                            <div className="text-xs leading-tight font-semibold">{pal.name}</div>
                            <div className="text-[10px] text-slate-400 leading-tight">{pal.tag}</div>
                          </div>
                        </div>
                        {palette === pal.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Architecture Modal trigger */}
            <button
              onClick={() => setIsArchOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Inspect Cloudflare Zero Trust & Worker Architecture"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Edge Stack</span>
            </button>

            {/* Role Switcher Pill */}
            <button
              onClick={handleRoleToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold transition"
              title={`Currently in ${role === 'ADMIN' ? 'Admin' : 'HR User'} mode. Click to toggle role.`}
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Role: <strong className="underline underline-offset-2">{role === 'ADMIN' ? 'ADMIN' : 'HR (Priya)'}</strong>
              </span>
              <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-blue-200/60 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Switch
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications Menu */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Gateway Alerts
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-500">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            markNotificationRead(item.id);
                            if (item.type === 'APPROVAL') {
                              navigate(role === 'ADMIN' ? '/admin/approvals' : '/hr/approvals');
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition ${
                            !item.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="mt-0.5">{getNotifIcon(item.type)}</div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {item.timestamp}
                            </span>
                          </div>
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-blue-200"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {user.role === 'ADMIN' ? 'CISO Admin' : 'HR Manager'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {user.department}
                      </div>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleRoleToggle();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Switch to {role === 'ADMIN' ? 'Priya HR' : 'Admin'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          resetDemoData();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                        <span>Reset Demo Data</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />
    </>
  );
};
