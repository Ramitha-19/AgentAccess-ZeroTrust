import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GatewayProvider } from './context/GatewayContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AgentsPage } from './pages/admin/AgentsPage';
import { AccessRequestsPage } from './pages/admin/AccessRequestsPage';
import { PoliciesPage } from './pages/admin/PoliciesPage';
import { RiskMonitoringPage } from './pages/admin/RiskMonitoringPage';
import { ApprovalsPage } from './pages/admin/ApprovalsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { ResourcesPage } from './pages/admin/ResourcesPage';
import { SettingsPage } from './pages/admin/SettingsPage';

import { HrDashboard } from './pages/hr/HrDashboard';
import { HrAgentStudio } from './pages/hr/HrAgentStudio';
import { HrApprovalsPage } from './pages/hr/HrApprovalsPage';
import { HrAuditPage } from './pages/hr/HrAuditPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'ADMIN' ? '/admin' : '/hr'} replace />;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const ProtectedHrRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GatewayProvider>
          <BrowserRouter>
            <Routes>
              {/* Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Root */}
              <Route path="/" element={<RootRedirect />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/agents"
                element={
                  <ProtectedAdminRoute>
                    <AgentsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <ProtectedAdminRoute>
                    <AccessRequestsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/policies"
                element={
                  <ProtectedAdminRoute>
                    <PoliciesPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/risk"
                element={
                  <ProtectedAdminRoute>
                    <RiskMonitoringPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedAdminRoute>
                    <ApprovalsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <ProtectedAdminRoute>
                    <AuditLogsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/resources"
                element={
                  <ProtectedAdminRoute>
                    <ResourcesPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <SettingsPage />
                  </ProtectedAdminRoute>
                }
              />

              {/* HR Routes */}
              <Route
                path="/hr"
                element={
                  <ProtectedHrRoute>
                    <HrDashboard />
                  </ProtectedHrRoute>
                }
              />
              <Route
                path="/hr/simulator"
                element={
                  <ProtectedHrRoute>
                    <HrAgentStudio />
                  </ProtectedHrRoute>
                }
              />
              <Route
                path="/hr/agents"
                element={
                  <ProtectedHrRoute>
                    <AgentsPage />
                  </ProtectedHrRoute>
                }
              />
              <Route
                path="/hr/approvals"
                element={
                  <ProtectedHrRoute>
                    <HrApprovalsPage />
                  </ProtectedHrRoute>
                }
              />
              <Route
                path="/hr/audit"
                element={
                  <ProtectedHrRoute>
                    <HrAuditPage />
                  </ProtectedHrRoute>
                }
              />
              <Route
                path="/hr/history"
                element={
                  <ProtectedHrRoute>
                    <HrAuditPage />
                  </ProtectedHrRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </BrowserRouter>
        </GatewayProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
