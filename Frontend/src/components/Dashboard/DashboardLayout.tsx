import React, { useState } from 'react';
import { Sidebar, DashboardTab } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { OverviewView } from './OverviewView';
import { ApplicationReviewView } from './ApplicationReviewView';
import { ComplianceRulesView } from './ComplianceRulesView';
import { AnomalyReviewView } from './AnomalyReviewView';
import { AuditTrailView } from './AuditTrailView';
import { DocumentVerificationView } from './DocumentVerificationView';
import { ReportsView } from './ReportsView';
import { SettingsView } from './SettingsView';
import { 
  ApplicationRecord, 
  ComplianceRule, 
  AnomalyItem, 
  AuditLogEntry, 
  ReviewStatus 
} from '../../types';

interface DashboardLayoutProps {
  onLogout: () => void;
  officerName: string;
  officerRole: string;
  applications: ApplicationRecord[];
  rules: ComplianceRule[];
  anomalies: AnomalyItem[];
  auditLogs: AuditLogEntry[];
  onUpdateApplicationStatus: (appId: string, newStatus: ReviewStatus, notes: string) => void;
  onToggleRule: (ruleId: string) => void;
  onResolveAnomaly: (anomalyId: string, status: AnomalyItem['resolutionStatus']) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onLogout,
  officerName,
  officerRole,
  applications,
  rules,
  anomalies,
  auditLogs,
  onUpdateApplicationStatus,
  onToggleRule,
  onResolveAnomaly,
}) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectApplication = (app: ApplicationRecord) => {
    setSelectedApplication(app);
  };

  const handleBackToOverview = () => {
    setSelectedApplication(null);
  };

  const handleUpdateStatusAndKeepFocus = (appId: string, newStatus: ReviewStatus, notes: string) => {
    onUpdateApplicationStatus(appId, newStatus, notes);
    if (selectedApplication && selectedApplication.id === appId) {
      setSelectedApplication(prev => prev ? { ...prev, status: newStatus, reviewerNotes: notes } : null);
    }
  };

  const getViewInfo = () => {
    if (selectedApplication) {
      return {
        title: `Scrutiny Workspace — ${selectedApplication.id}`,
        subtitle: selectedApplication.institutionName,
      };
    }
    switch (currentTab) {
      case 'overview':
        return { title: 'Executive Scrutiny Overview', subtitle: 'Institutional approval pipeline for AY 2026–27' };
      case 'applications':
        return { title: 'Institutional Applications', subtitle: 'Manage submissions across Engineering, Management, and Tech' };
      case 'verification':
        return { title: 'Document Verification Ledger', subtitle: 'OCR parsed legal, land, and cadre records' };
      case 'rules':
        return { title: 'Compliance Rulebook (APH 2026–27)', subtitle: 'Statutory threshold definitions and mandates' };
      case 'anomalies':
        return { title: 'Anomaly & Discrepancy Review', subtitle: 'Cross-institution duplicate checks and flags' };
      case 'audit':
        return { title: 'Tamper-Evident Audit Trail', subtitle: 'Immutable SHA-256 signed regulatory activity log' };
      case 'reports':
        return { title: 'Compliance Analytics & Digests', subtitle: 'Regional performance and clearance statistics' };
      case 'settings':
        return { title: 'Officer Workstation Settings', subtitle: 'Verification parameters and scrutiny options' };
      default:
        return { title: 'Dashboard', subtitle: 'AICTE Institutional Compliance' };
    }
  };

  const viewInfo = getViewInfo();

  return (
    <div className="min-h-screen bg-[#0C1624] flex flex-col md:flex-row antialiased text-[#F6F0D5] relative overflow-hidden selection:bg-[#F6F0D5] selection:text-[#0C1624]">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedApplication(null);
          setSearchQuery('');
        }}
        onLogout={onLogout}
        officerName={officerName}
        officerRole={officerRole}
        anomalyCount={anomalies.filter(a => a.resolutionStatus === 'Unresolved').length}
      />

      {/* Main Workspace Region with exact #0C1624 background */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden relative z-10 bg-[#0C1624]">
        {/* Top Navbar */}
        <TopNavbar
          title={viewInfo.title}
          subtitle={viewInfo.subtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCount={anomalies.filter(a => a.resolutionStatus === 'Unresolved').length}
        />

        {/* Dynamic View Routing */}
        <main className="flex-1 pb-16 bg-[#0C1624]">
          {selectedApplication ? (
            <ApplicationReviewView
              application={selectedApplication}
              onBack={handleBackToOverview}
              onUpdateStatus={handleUpdateStatusAndKeepFocus}
              officerName={officerName}
            />
          ) : currentTab === 'overview' || currentTab === 'applications' ? (
            <OverviewView
              applications={applications}
              onSelectApplication={handleSelectApplication}
              searchQuery={searchQuery}
            />
          ) : currentTab === 'verification' ? (
            <DocumentVerificationView
              applications={applications}
              onOpenApplication={(app) => {
                setSelectedApplication(app);
              }}
              searchQuery={searchQuery}
            />
          ) : currentTab === 'rules' ? (
            <ComplianceRulesView
              rules={rules}
              onToggleRule={onToggleRule}
              searchQuery={searchQuery}
            />
          ) : currentTab === 'anomalies' ? (
            <AnomalyReviewView
              anomalies={anomalies}
              onResolveAnomaly={onResolveAnomaly}
              onOpenApplication={(appId) => {
                const target = applications.find(a => a.id === appId);
                if (target) {
                  setSelectedApplication(target);
                }
              }}
              searchQuery={searchQuery}
            />
          ) : currentTab === 'audit' ? (
            <AuditTrailView
              logs={auditLogs}
              searchQuery={searchQuery}
            />
          ) : currentTab === 'reports' ? (
            <ReportsView />
          ) : currentTab === 'settings' ? (
            <SettingsView
              officerName={officerName}
              officerRole={officerRole}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
};
