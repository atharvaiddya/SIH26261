import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-[#F6F0D5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F6F0D5]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif-editorial text-[#F6F0D5] tracking-tight">
            Scrutiny Analytics & Compliance Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CEAA]/70 mt-0.5">
            Regional clearance velocity, anomaly frequency distributions, and statutory approval yields for AY 2026–27.
          </p>
        </div>

        <button 
          onClick={() => alert('Exporting AY 2026-27 AICTE Scrutiny Summary Report (PDF/Excel)...')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F6F0D5] text-[#0F1B2C] hover:bg-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F1B2C]" />
          <span>Export Scrutiny Digest</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="text-xs text-[#D9CEAA]/70 font-semibold uppercase tracking-wider mb-1">
            Verification Yield Rate
          </div>
          <div className="text-3xl font-semibold text-[#F6F0D5]">84.2%</div>
          <div className="text-xs text-[#D9CEAA]/60 mt-1">First-pass compliance adherence</div>
        </div>

        <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="text-xs text-[#D9CEAA]/70 font-semibold uppercase tracking-wider mb-1">
            Avg. Scrutiny Turnaround
          </div>
          <div className="text-3xl font-semibold text-[#F6F0D5]">3.4 Days</div>
          <div className="text-xs text-[#D9CEAA]/60 mt-1">Down from 18 days (Manual Process)</div>
        </div>

        <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="text-xs text-[#D9CEAA]/70 font-semibold uppercase tracking-wider mb-1">
            Ghost Faculty Interceptions
          </div>
          <div className="text-3xl font-semibold text-amber-300">12 Instances</div>
          <div className="text-xs text-[#D9CEAA]/60 mt-1">Aadhaar-token deduplication alerts</div>
        </div>
      </div>

      {/* Regional Clearance Table & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] space-y-4">
          <h3 className="text-sm font-semibold text-[#F6F0D5]">
            Regional Scrutiny Distribution (AY 2026–27)
          </h3>
          <div className="space-y-3 pt-2">
            {[
              { region: 'Western Region (Mumbai)', submitted: 1420, approved: 1180, pending: 240, progress: 83 },
              { region: 'Southern Region (Chennai)', submitted: 1680, approved: 1410, pending: 270, progress: 84 },
              { region: 'North-West Region (Chandigarh)', submitted: 890, approved: 720, pending: 170, progress: 80 },
              { region: 'South-Western Region (Bengaluru)', submitted: 1120, approved: 980, pending: 140, progress: 87 },
              { region: 'Eastern Region (Kolkata)', submitted: 640, approved: 490, pending: 150, progress: 76 },
            ].map((r, i) => (
              <div key={i} className="space-y-1.5 p-3 rounded-xl bg-[#0D1826]/90 border border-[#F6F0D5]/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F6F0D5]">{r.region}</span>
                  <span className="font-mono text-[#D9CEAA]/80">{r.approved} / {r.submitted} Scrutinized ({r.progress}%)</span>
                </div>
                <div className="w-full bg-[#09111C] h-2 rounded-full overflow-hidden border border-[#F6F0D5]/10">
                  <div 
                    className="bg-[#F6F0D5] h-full rounded-full transition-all"
                    style={{ width: `${r.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Frequent Deficiencies */}
        <div className="lg:col-span-4 bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] space-y-4">
          <h3 className="text-sm font-semibold text-[#F6F0D5]">
            Prevalent Deficiency Types
          </h3>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Faculty Cadre Disproportion (Clause 5.2)', percent: 38, count: '148 cases' },
              { label: 'Expired Fire Safety NOC (Clause 6.1)', percent: 27, count: '105 cases' },
              { label: 'Land Lease Renewal Lapsed (Clause 4.1)', percent: 18, count: '70 cases' },
              { label: 'RPwD Ramp / Barrier-Free Lacking', percent: 11, count: '43 cases' },
              { label: 'Bank FDR Joint Lien Discrepancy', percent: 6, count: '23 cases' },
            ].map((d, i) => (
              <div key={i} className="text-xs p-2.5 rounded-lg bg-[#0D1826]/90 border border-[#F6F0D5]/10">
                <div className="flex justify-between font-medium text-[#F6F0D5] mb-1">
                  <span className="line-clamp-1">{d.label}</span>
                  <span className="shrink-0 font-mono text-[#F6F0D5]">{d.percent}%</span>
                </div>
                <div className="text-[10px] text-[#D9CEAA]/60">{d.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
