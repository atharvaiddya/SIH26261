import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronRight, 
  X 
} from 'lucide-react';

interface TopNavbarProps {
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCount?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  unreadCount = 3,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const notifications = [
    { id: 1, title: 'Duplicate Aadhaar flag detected', time: '12m ago', desc: 'Faculty cross-institutional match on APP-2026-AICTE-1340' },
    { id: 2, title: 'Fire NOC verified', time: '1h ago', desc: 'Gurugram School of Management uploaded renewed certificate' },
    { id: 3, title: 'Regional quota update', time: '3h ago', desc: 'Southern Region approval quota updated for emerging tech branches' },
  ];

  return (
    <header className="bg-[#0C1624] border-b border-[#F6F0D5]/15 px-6 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 text-[#F6F0D5]">
      {/* Title & Hierarchy */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-[#D9CEAA]/70 mb-0.5 font-medium">
          <span>AICTE Scrutiny Portal</span>
          <ChevronRight className="w-3 h-3 text-[#F6F0D5]/35" />
          <span className="text-[#F6F0D5] font-semibold">{title}</span>
        </div>
        <h1 className="text-base sm:text-lg font-semibold text-[#F6F0D5] tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#D9CEAA]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search applications, institutions, AICTE ID, or clauses..."
            className="w-full pl-10 pr-9 py-2 text-xs bg-[#111F33] hover:bg-[#162740] focus:bg-[#111F33] border border-[#F6F0D5]/20 rounded-xl text-[#F6F0D5] placeholder-[#D9CEAA]/40 focus:outline-none focus:border-[#F6F0D5] focus:ring-1 focus:ring-[#F6F0D5] transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9CEAA]/60 hover:text-[#F6F0D5]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Notifications, Guide, Portal Chip */}
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-xl text-[#D9CEAA]/70 hover:text-[#F6F0D5] hover:bg-[#111F33] transition-colors cursor-pointer"
          title="Scrutiny Handbook Help"
          aria-label="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-[#D9CEAA]/70 hover:text-[#F6F0D5] hover:bg-[#111F33] transition-colors cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F6F0D5]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0C1624] border border-[#F6F0D5]/20 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.7)] p-4 z-50 animate-fade-in text-left text-[#F6F0D5]">
              <div className="flex items-center justify-between pb-3 border-b border-[#F6F0D5]/15 mb-3">
                <span className="text-xs font-semibold text-[#F6F0D5]">Scrutiny Alerts</span>
                <span className="text-[10px] text-[#D9CEAA]/70">3 new events</span>
              </div>
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="text-xs p-2.5 rounded-lg bg-[#111F33] border border-[#F6F0D5]/10 hover:border-[#F6F0D5]/30 transition-colors">
                    <div className="flex items-center justify-between text-[#F6F0D5] font-medium mb-1">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#D9CEAA]/60 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#D9CEAA]/80 leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Portal Status Chip */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#F6F0D5]/15 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-[#D9CEAA]/80 font-medium">Scrutiny Node Online</span>
        </div>
      </div>
    </header>
  );
};
