import React from 'react';
import { 
  LayoutDashboard, 
  Files, 
  FileCheck, 
  Scale, 
  AlertTriangle, 
  History, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

export type DashboardTab = 
  | 'overview'
  | 'applications'
  | 'verification'
  | 'rules'
  | 'anomalies'
  | 'audit'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onLogout: () => void;
  officerName: string;
  officerRole: string;
  anomalyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  officerName,
  officerRole,
  anomalyCount,
}) => {
  const navItems: { id: DashboardTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Files },
    { id: 'verification', label: 'Document Verification', icon: FileCheck },
    { id: 'rules', label: 'Compliance Rules', icon: Scale },
    { id: 'anomalies', label: 'Anomaly Review', icon: AlertTriangle, badge: anomalyCount },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      aria-label="Sidebar navigation"
      className="w-64 bg-[#0C1624] border-r border-[#F6F0D5]/15 h-screen sticky top-0 flex flex-col justify-between select-none shrink-0 text-[#F6F0D5]"
    >
      {/* Top Branding Header */}
      <div>
        <div className="px-6 py-5 border-b border-[#F6F0D5]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F6F0D5] flex items-center justify-center text-[#0C1624] shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-[#F6F0D5] leading-tight">FRAUD CAUGHT</div>
              <div className="text-[10px] uppercase tracking-wider text-[#D9CEAA]/70 font-medium">Setu AICTE Workspace</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#F6F0D5]/10 text-[#F6F0D5] border border-[#F6F0D5]/20">
            v2.6
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer text-left relative ${
                  isActive
                    ? 'bg-[#F6F0D5] text-[#0C1624] font-semibold shadow-xs'
                    : 'text-[#D9CEAA]/80 hover:bg-[#111F33] hover:text-[#F6F0D5]'
                }`}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#0C1624] rounded-r-full" />
                )}

                <div className="flex items-center gap-3 pl-1">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#0C1624]' : 'text-[#D9CEAA]/80 group-hover:text-[#F6F0D5]'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive 
                      ? 'bg-[#0C1624] text-[#F6F0D5]' 
                      : 'bg-[#F6F0D5]/20 text-[#F6F0D5] border border-[#F6F0D5]/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Officer Profile & Logout */}
      <div className="p-4 border-t border-[#F6F0D5]/15 space-y-3">
        {/* Scrutiny Cycle Info */}
        <div className="px-3 py-2 rounded-lg bg-[#111F33] border border-[#F6F0D5]/10 text-[11px] text-[#D9CEAA]/70">
          <div className="flex items-center justify-between text-[#F6F0D5] font-medium mb-0.5">
            <span>Cycle 2026–27</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div>Portal Scrutiny Phase II</div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#F6F0D5] text-[#0C1624] text-xs font-semibold flex items-center justify-center shrink-0">
              {officerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#F6F0D5] truncate">{officerName}</div>
              <div className="text-[10px] text-[#D9CEAA]/70 truncate">{officerRole}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out of portal"
            aria-label="Sign out"
            className="p-1.5 rounded-lg text-[#D9CEAA]/70 hover:text-[#F6F0D5] hover:bg-[#111F33] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
