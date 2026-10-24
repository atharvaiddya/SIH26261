import React, { useState } from 'react';
import { 
  Check, 
  Save 
} from 'lucide-react';

interface SettingsViewProps {
  officerName: string;
  officerRole: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  officerName,
  officerRole,
}) => {
  const [ocrThreshold, setOcrThreshold] = useState<number>(95);
  const [autoFlagGhostFaculty, setAutoFlagGhostFaculty] = useState<boolean>(true);
  const [requireDoubleSignoff, setRequireDoubleSignoff] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto text-[#F6F0D5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F6F0D5]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif-editorial text-[#F6F0D5] tracking-tight">
            Scrutiny Officer Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CEAA]/70 mt-0.5">
            Configure OCR discrepancy sensitivity, anti-ghost faculty safeguards, and notification preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#F6F0D5] text-[#0F1B2C] hover:bg-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          {isSaved ? <Check className="w-3.5 h-3.5 text-[#0F1B2C]" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Preferences Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F6F0D5]">
          Designated Officer Profile
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F6F0D5] text-[#0F1B2C] text-base font-semibold flex items-center justify-center">
            {officerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-semibold text-[#F6F0D5]">{officerName}</div>
            <div className="text-xs text-[#D9CEAA]/70">{officerRole}</div>
            <div className="text-[11px] font-mono text-[#D9CEAA]/50 mt-0.5">AICTE Digital Certificate ID: #AIC-REG-2026-9921</div>
          </div>
        </div>
      </div>

      {/* Verification Sensitivity Settings */}
      <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F6F0D5]">
          AICTE Scrutiny Engine Parameters
        </h3>

        {/* OCR Confidence Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#F6F0D5]">Minimum OCR Clause Confidence Threshold</label>
            <span className="font-mono text-[#F6F0D5] font-semibold">{ocrThreshold}%</span>
          </div>
          <input
            type="range"
            min="80"
            max="99"
            value={ocrThreshold}
            onChange={(e) => setOcrThreshold(Number(e.target.value))}
            className="w-full accent-[#F6F0D5] cursor-pointer"
          />
          <p className="text-[11px] text-[#D9CEAA]/70">
            Clauses parsed below this threshold will automatically be sent to the officer for manual human re-verification.
          </p>
        </div>

        <div className="pt-2 border-t border-[#F6F0D5]/15 space-y-3">
          {/* Ghost Faculty Toggle */}
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-[#F6F0D5]">Automated Ghost Faculty Cross-Search</div>
              <div className="text-[11px] text-[#D9CEAA]/70">
                Check Aadhaar/PAN tokens against nationwide AICTE database for duplicate appointments.
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoFlagGhostFaculty}
              onChange={(e) => setAutoFlagGhostFaculty(e.target.checked)}
              className="accent-[#F6F0D5] w-4 h-4 mt-0.5"
            />
          </label>

          {/* Double Signoff Toggle */}
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-[#F6F0D5]">Mandate Secondary Regional Sign-off for Escalations</div>
              <div className="text-[11px] text-[#D9CEAA]/70">
                Require Regional Director countersignature on all applications marked for standing complaint committee.
              </div>
            </div>
            <input
              type="checkbox"
              checked={requireDoubleSignoff}
              onChange={(e) => setRequireDoubleSignoff(e.target.checked)}
              className="accent-[#F6F0D5] w-4 h-4 mt-0.5"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
