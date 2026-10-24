import React from 'react';
import { ArrowDown, ArrowUp, ArrowRight, ShieldAlert } from 'lucide-react';

interface LandingPageProps {
  onNext: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNext }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center text-[#F6F0D5] overflow-hidden selection:bg-[#F6F0D5] selection:text-[#263B56] px-6 py-10">
      {/* Background layer: Blue with lowered transparency (semi-translucent navy blue) */}
      <div className="fixed inset-0 bg-[#263B56]/90 backdrop-blur-md pointer-events-none z-0" />
      
      {/* Subtle atmospheric ambient glow in yellow/navy */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#F6F0D5]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Subtle fine geometric watermark pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#F6F0D5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>
      </div>

      {/* Discreet Top AICTE / SIH Indicator */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5 text-xs tracking-widest uppercase font-mono text-[#F6F0D5]/70">
          <div className="w-2 h-2 rounded-full bg-[#F6F0D5] animate-pulse" />
          <span>SETU • SIH26261</span>
        </div>
        <div className="text-[11px] font-mono text-[#F6F0D5]/60 tracking-wider">
          AICTE SCRUTINY ENGINE
        </div>
      </header>

      {/* CENTER HERO: "Fraud Caught" & Quote Underneath */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-4xl px-4 py-12">
        {/* Site Name in Yellow Typography */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif-editorial text-[#F6F0D5] tracking-tight leading-[0.98] font-normal mb-8 drop-shadow-sm select-none">
          Fraud Caught
        </h1>

        {/* Divider accent line */}
        <div className="w-16 h-[1.5px] bg-[#F6F0D5]/40 mb-8 rounded-full" />

        {/* Quote Underneath (Neeche) */}
        <p className="text-xl sm:text-2xl md:text-3xl font-serif-editorial italic text-[#F6F0D5]/90 tracking-wide font-light max-w-2xl leading-relaxed">
          &ldquo;Anonymity breeds disinhibition&rdquo;
        </p>

        <p className="text-xs sm:text-sm font-sans text-[#F6F0D5]/60 mt-4 tracking-widest uppercase font-mono">
          AICTE Institutional Compliance & Evidence Verification
        </p>
      </main>

      {/* BASE OF THE LANDING PAGE: Arrow Control to Go to Login */}
      <footer className="relative z-10 flex flex-col items-center pb-6 gap-3">
        <button
          onClick={onNext}
          aria-label="Next - Proceed to Login"
          className="group flex flex-col items-center gap-2 cursor-pointer text-[#F6F0D5] hover:text-white transition-all focus:outline-none"
        >
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#F6F0D5]/80 group-hover:text-[#F6F0D5] transition-colors">
            Next
          </span>

          {/* Arrow Button with Subtle Bounce / Float Animation */}
          <div className="w-12 h-12 rounded-full border border-[#F6F0D5]/40 bg-[#F6F0D5]/10 hover:bg-[#F6F0D5]/20 backdrop-blur-xs flex items-center justify-center transition-all duration-300 group-hover:border-[#F6F0D5] group-hover:scale-105 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            <ArrowDown className="w-5 h-5 text-[#F6F0D5] transition-transform duration-300 group-hover:translate-y-1 animate-bounce" />
          </div>
        </button>
      </footer>
    </div>
  );
};
