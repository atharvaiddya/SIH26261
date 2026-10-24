import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { 
  INITIAL_APPLICATIONS, 
  COMPLIANCE_RULES, 
  ANOMALIES_LIST, 
  AUDIT_TRAIL 
} from './data/mockData';
import { 
  ApplicationRecord, 
  ComplianceRule, 
  AnomalyItem, 
  AuditLogEntry, 
  ReviewStatus 
} from './types';

export default function App() {
  // Screen state: 'landing' or 'dashboard'
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'dashboard'>('landing');
  // Login modal upward slide visibility
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Authenticated officer state
  const [officerName, setOfficerName] = useState<string>('Dr. Ramanathan S.');
  const [officerRole, setOfficerRole] = useState<string>('Senior Scrutiny Officer (RO Mumbai)');

  // Main state data
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [rules, setRules] = useState<ComplianceRule[]>(COMPLIANCE_RULES);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>(ANOMALIES_LIST);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(AUDIT_TRAIL);

  // Handlers
  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleLoginSuccess = (name: string, role: string) => {
    setOfficerName(name);
    setOfficerRole(role);
    setIsLoginOpen(false);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('landing');
  };

  // State mutators for applications, rules, anomalies & audit logs
  const handleUpdateApplicationStatus = (appId: string, newStatus: ReviewStatus, notes: string) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    const targetApp = applications.find(a => a.id === appId);
    const instName = targetApp ? targetApp.institutionName : 'Institution';

    // 1. Update application record
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          reviewerNotes: notes,
          lastUpdated: new Date().toISOString().slice(0, 10),
        };
      }
      return app;
    }));

    // 2. Generate cryptographic SHA-256 dummy signature
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newAuditLog: AuditLogEntry = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp,
      officerName,
      officerRole,
      applicationId: appId,
      action: `Status Updated to "${newStatus}"`,
      details: notes || `Scrutiny officer executed decision for ${instName}.`,
      ipAddress: '10.24.112.45 (NIC-AICTE VPN)',
      hashSignature: `sha256:${randomHex}`,
    };

    setAuditLogs(prev => [newAuditLog, ...prev]);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
  };

  const handleResolveAnomaly = (anomalyId: string, status: AnomalyItem['resolutionStatus']) => {
    setAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, resolutionStatus: status } : a));
  };

  return (
    <div className="min-h-screen bg-[#263B56] antialiased">
      {currentScreen === 'landing' ? (
        <>
          {/* Ultra-concise Landing Page: Translucent blue background, yellow typography, "Fraud Caught" & Quote */}
          <LandingPage onNext={handleOpenLogin} />

          {/* Upward Sliding Translucent Login Modal */}
          <LoginModal
            isOpen={isLoginOpen}
            onClose={handleCloseLogin}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      ) : (
        /* Dashboard Screen (Solid, Light Background) */
        <DashboardLayout
          onLogout={handleLogout}
          officerName={officerName}
          officerRole={officerRole}
          applications={applications}
          rules={rules}
          anomalies={anomalies}
          auditLogs={auditLogs}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onToggleRule={handleToggleRule}
          onResolveAnomaly={handleResolveAnomaly}
        />
      )}
    </div>
  );
}
