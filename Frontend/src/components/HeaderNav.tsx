import React from 'react';
import { ShieldCheck, ArrowUpRight, Compass, FileCheck2, Scale } from 'lucide-react';

interface HeaderNavProps {
  onOpenLogin: () => void;
  onScrollToWorkflow: () => void;
  onScrollToCompliance: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenLogin,
  onScrollToWorkflow,
  onScrollToCompliance,
}) => {
  return (
    <header className="fixed top-5 left-0 right-0 z-40 px-4 sm:px-6 max-w-6xl mx-auto">
      <nav 
        aria-label="Main Navigation"
        className="backdrop-blur-md bg-[#FBFAF4]/90 border border-[#DDE1E2] rounded-full px-4 sm:px-6 py-2.5 shadow-[0_4px_24px_rgba(38,59,86,0.06)] flex items-center justify-between transition-all"
      >
        {/* Brand Wordmark & AICTE Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#263B56] flex items-center justify-center text-[#F6F0D5] shadow-xs">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg tracking-tight text-[#263B56]">SETU</span>
            <span className="text-[11px] uppercase tracking-wider text-[#60748A] hidden sm:inline-block font-medium">
              AICTE Scrutiny Engine
            </span>
          </div>
        </div>

        {/* Center Pill Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#E9EEF1]/60 p-1 rounded-full border border-[#DDE1E2]/60 text-xs font-medium text-[#263B56]">
          <button
            onClick={onScrollToCompliance}
            className="px-3.5 py-1.5 rounded-full hover:bg-white hover:text-[#263B56] transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-[#60748A]" />
            APH 2026-27 Norms
          </button>
          <button
            onClick={onScrollToWorkflow}
            className="px-3.5 py-1.5 rounded-full hover:bg-white hover:text-[#263B56] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#60748A]" />
            Scrutiny Lifecycle
          </button>
          <span className="px-3 py-1 text-[11px] text-[#60748A] flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-[#60748A]" />
            SIH26261
          </span>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLogin}
            className="text-xs sm:text-sm font-medium text-[#263B56] hover:text-[#343B43] px-3 py-1.5 rounded-full hover:bg-[#E9EEF1]/60 transition-colors"
          >
            Login
          </button>
          <button
            onClick={onOpenLogin}
            className="text-xs sm:text-sm font-medium bg-[#263B56] hover:bg-[#1E2E43] text-[#FBFAF4] px-4 sm:px-5 py-2 rounded-full transition-all shadow-xs flex items-center gap-1.5 group"
          >
            <span>Enter Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#F6F0D5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </nav>
    </header>
  );
};
