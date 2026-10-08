import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, DUAL_PALETTES } from '../../context/ThemeContext';
import { useGateway } from '../../context/GatewayContext';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  RefreshCw,
  Lock,
  CheckCircle2,
  Palette,
  Check,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, setTheme, palette, setPalette, paletteInfo } = useTheme();
  const { resetDemoData } = useGateway();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security toggles
  const [mtlsEnforced, setMtlsEnforced] = useState(true);
  const [dualCustodyDefault, setDualCustodyDefault] = useState(true);
  const [rateLimitMax, setRateLimitMax] = useState(30);

  // Notifications toggles
  const [notifApproval, setNotifApproval] = useState(true);
  const [notifViolations, setNotifViolations] = useState(true);
  const [notifDailyDigest, setNotifDailyDigest] = useState(false);

  const [language, setLanguage] = useState('English (India)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          System & Governance Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure security baselines, Cloudflare edge proxy thresholds, user profile, and display preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'profile', name: 'Profile & Identity', icon: User },
            { id: 'security', name: 'Edge Zero Trust', icon: Shield },
            { id: 'notifications', name: 'Alerts & Dispatch', icon: Bell },
            { id: 'preferences', name: 'Theme & Language', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to default initial state?')) {
                  resetDemoData();
                  alert('Demo state restored.');
                }
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-9 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings successfully synchronized across Cloudflare Edge nodes!</span>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Operator Profile Information
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-200 dark:border-blue-800 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {user?.name}
                  </h4>
                  <p className="text-xs text-slate-500">{user?.title}</p>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mt-1 inline-block">
                    {user?.department}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Cloudflare Edge Zero Trust Controls
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Enforce Mutual TLS (mTLS) on All Agent Requests
                    </h5>
                    <p className="text-slate-500 mt-0.5">
                      Ensures only cryptographic keys issued to registered agents can hit gateway endpoints.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={mtlsEnforced}
                    onChange={(e) => setMtlsEnforced(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Mandatory Dual-Custody for EXPORT Operations
                    </h5>
                    <p className="text-slate-500 mt-0.5">
                      Forces all bulk data exfiltrations to require human sign-off regardless of risk score.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dualCustodyDefault}
                    onChange={(e) => setDualCustodyDefault(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Rate Limiting Threshold (Cloudflare WAF)
                    </h5>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {rateLimitMax} req/min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={rateLimitMax}
                    onChange={(e) => setRateLimitMax(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-[11px] text-slate-500">
                    Velocity surges beyond {rateLimitMax} queries/min immediately trigger rate limiting and behavioral freeze.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Update Edge Defense Posture
                </button>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Alert Dispatch Rules
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span>Approval Required Real-time Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifApproval}
                    onChange={(e) => setNotifApproval(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span>Critical Policy Violation Alerts</span>
                  <input
                    type="checkbox"
                    checked={notifViolations}
                    onChange={(e) => setNotifViolations(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span>Daily Risk Digest Email</span>
                  <input
                    type="checkbox"
                    checked={notifDailyDigest}
                    onChange={(e) => setNotifDailyDigest(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Save Notification Rules
                </button>
              </div>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Appearance & Regional
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Professional Dual-Colored Palette
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    Select the authoritative dual-tone color scheme for your enterprise gateway.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                    {Object.values(DUAL_PALETTES).map((pal) => {
                      const isSelected = palette === pal.id;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => setPalette(pal.id)}
                          className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 shadow-sm ring-1 ring-blue-500/30'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center -space-x-1.5">
                              <span
                                className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                                style={{ backgroundColor: pal.primaryColor }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                                style={{ backgroundColor: pal.secondaryColor }}
                              />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {pal.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {pal.tag}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Interface Light / Dark Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                        theme === 'light'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Light Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                        theme === 'dark'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-blue-600" />
                      <span>Dark Mode</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Language & Locale
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full max-w-sm px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="English (India)">English (India - IST)</option>
                    <option value="English (US)">English (US - UTC)</option>
                    <option value="English (UK)">English (UK - BST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
