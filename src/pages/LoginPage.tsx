import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, UserCheck, Lock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, availableUsers } = useAuth();
  const { paletteInfo } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('priya@agentaccess.demo');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email);
    if (success) {
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/hr');
      }
    }
  };

  const selectDemoAccount = (demoEmail: string, role: string) => {
    setEmail(demoEmail);
    login(demoEmail);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/hr');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-md mb-4 text-white">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Agent<span className="text-blue-600 dark:text-blue-400">Access</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Context-Aware Authorization Gateway for Personalized AI Agents
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Cloudflare Zero Trust Edge Gateway Prototype
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 border-t-4 border-t-blue-600">
          {/* Core Principle Notice */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300">
            <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
              Core Security Principle
            </div>
            Human employee authorization does <strong>not</strong> automatically grant an AI agent unlimited authorization.
          </div>

          {/* Quick 1-Click Role Switcher Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1-Click Demo Accounts:
            </label>
            <div className="space-y-2.5">
              {/* HR User: Priya */}
              <button
                type="button"
                onClick={() => selectDemoAccount('priya@agentaccess.demo', 'HR_USER')}
                className="w-full p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left transition flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt="Priya Sharma"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        Priya Sharma
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                        HR MANAGER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      priya@agentaccess.demo • Owner of <em>Priya HR Agent</em>
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Admin: Vikram */}
              <button
                type="button"
                onClick={() => selectDemoAccount('admin@agentaccess.demo', 'ADMIN')}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    alt="Vikram Malhotra"
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-300"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        Vikram Malhotra
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        SECURITY ADMIN (CISO)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      admin@agentaccess.demo • Full Security & Policy Controls
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-mono text-[11px]">
                Or Sign In with Demo Email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. priya@agentaccess.demo"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Access Gateway Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>
            AgentAccess Prototype • Evaluates AI agent requests using Deterministic Policy & Real-Time Risk Engine
          </p>
        </div>
      </div>
    </div>
  );
};
