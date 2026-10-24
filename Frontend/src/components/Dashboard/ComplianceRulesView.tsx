import React, { useState } from 'react';
import { ComplianceRule } from '../../types';
import { Scale } from 'lucide-react';

interface ComplianceRulesViewProps {
  rules: ComplianceRule[];
  onToggleRule: (ruleId: string) => void;
  searchQuery: string;
}

export const ComplianceRulesView: React.FC<ComplianceRulesViewProps> = ({
  rules,
  onToggleRule,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Land & Legal', 'Faculty & Cadre', 'Building & Safety', 'Finance & FDR'];

  const filteredRules = rules.filter(r => {
    const matchesSearch = 
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-[#F6F0D5]">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F6F0D5]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif-editorial text-[#F6F0D5] tracking-tight">
            AICTE Compliance Rule Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CEAA]/70 mt-0.5">
            Prescribed statutory norms from the Approval Process Handbook (APH 2026–27 Gazetted).
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1826]/90 border border-[#F6F0D5]/20 text-xs text-[#F6F0D5] font-medium self-start sm:self-auto">
          <Scale className="w-3.5 h-3.5 text-[#F6F0D5]" />
          <span>Gazetted Edition 2026.2 Active</span>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold shadow-xs'
                : 'bg-[#132236]/90 border border-[#F6F0D5]/15 text-[#D9CEAA]/80 hover:bg-[#182B44] hover:text-[#F6F0D5]'
            }`}
          >
            {cat === 'ALL' ? 'All Compliance Categories' : cat}
          </button>
        ))}
      </div>

      {/* Rules Table / Cards */}
      <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="p-5 border-b border-[#F6F0D5]/15 bg-[#0D1826]/95 flex items-center justify-between">
          <div className="text-xs font-semibold text-[#F6F0D5] uppercase tracking-wider">
            Active Rulebook ({filteredRules.length} Rules Enforced)
          </div>
          <div className="text-[11px] text-[#D9CEAA]/70">
            Rules cross-referenced during OCR parsing
          </div>
        </div>

        <div className="divide-y divide-[#F6F0D5]/10">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="p-5 sm:p-6 hover:bg-[#182B44]/50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Rule Code & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#F6F0D5] bg-[#0D1826] px-2.5 py-1 rounded-md border border-[#F6F0D5]/20">
                      {rule.code}
                    </span>
                    <span className="text-xs font-medium text-[#D9CEAA] px-2 py-0.5 rounded bg-[#182B44] border border-[#F6F0D5]/15">
                      {rule.category}
                    </span>
                    <span className="text-[11px] text-[#D9CEAA]/70">
                      {rule.aphChapter}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      rule.severityIfViolated === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    }`}>
                      {rule.severityIfViolated} Severity
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#F6F0D5]">
                    {rule.name}
                  </h3>

                  <p className="text-xs text-[#D9CEAA] leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs font-medium text-[#F6F0D5] bg-[#0D1826]/90 px-3 py-1.5 rounded-lg border border-[#F6F0D5]/15">
                    <span className="text-[#D9CEAA]/70 font-normal">Prescribed Norm:</span>
                    <span>{rule.prescribedThreshold}</span>
                  </div>
                </div>

                {/* Right side: Version & Toggle State */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F6F0D5]/15">
                  <div className="text-right text-[11px] text-[#D9CEAA]/70">
                    <div>Version: <span className="font-mono font-medium text-[#F6F0D5]">{rule.version}</span></div>
                    <div>Updated: {rule.lastUpdated}</div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs font-medium text-[#D9CEAA]/80">
                      {rule.isActive ? 'Active Rule' : 'Inactive'}
                    </span>
                    <input
                      type="checkbox"
                      checked={rule.isActive}
                      onChange={() => onToggleRule(rule.id)}
                      className="sr-only"
                    />
                    <div 
                      onClick={() => onToggleRule(rule.id)}
                      className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 cursor-pointer ${
                        rule.isActive ? 'bg-[#F6F0D5]' : 'bg-[#0D1826] border border-[#F6F0D5]/20'
                      }`}
                    >
                      <div 
                        className={`w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ${
                          rule.isActive ? 'bg-[#0F1B2C] translate-x-5' : 'bg-[#D9CEAA]'
                        }`} 
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
