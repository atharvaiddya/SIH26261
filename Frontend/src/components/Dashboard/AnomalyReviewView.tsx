import React, { useState } from 'react';
import { AnomalyItem, SeverityLevel } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileSearch, 
  ExternalLink 
} from 'lucide-react';

interface AnomalyReviewViewProps {
  anomalies: AnomalyItem[];
  onResolveAnomaly: (anomalyId: string, status: AnomalyItem['resolutionStatus']) => void;
  onOpenApplication: (appId: string) => void;
  searchQuery: string;
}

export const AnomalyReviewView: React.FC<AnomalyReviewViewProps> = ({
  anomalies,
  onResolveAnomaly,
  onOpenApplication,
  searchQuery,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAnomalies = anomalies.filter((item) => {
    const matchesSearch = 
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applicationId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || item.resolutionStatus === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>High Severity</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Medium Severity</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D1826] text-[#F6F0D5] border border-[#F6F0D5]/20">
            <Clock className="w-3 h-3 text-[#D9CEAA]" />
            <span>Advisory</span>
          </span>
        );
    }
  };

  const getResolutionBadge = (status: AnomalyItem['resolutionStatus']) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="text-xs font-medium text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-400/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </span>
        );
      case 'Investigating':
        return (
          <span className="text-xs font-medium text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-400/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Investigating</span>
          </span>
        );
      case 'Accepted with Justification':
        return (
          <span className="text-xs font-medium text-[#0F1B2C] bg-[#F6F0D5] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
            <FileSearch className="w-3.5 h-3.5 text-[#0F1B2C]" />
            <span>Accepted Justification</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-400/30 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Unresolved</span>
          </span>
        );
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-[#F6F0D5]">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F6F0D5]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif-editorial text-[#F6F0D5] tracking-tight">
            Institutional Anomaly Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CEAA]/70 mt-0.5">
            Discrepancies identified via OCR clause verification, cross-institutional deduplication, and statutory norm checks.
          </p>
        </div>

        <div className="text-xs text-[#D9CEAA]/70">
          Total Flagged: <span className="font-semibold text-[#F6F0D5]">{anomalies.length} items</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-[#132236]/90 border border-[#F6F0D5]/15 rounded-xl px-3 py-1.5 text-[#F6F0D5]">
          <label htmlFor="anomaly-severity-filter" className="text-[#D9CEAA]/70">Severity:</label>
          <select
            id="anomaly-severity-filter"
            aria-label="Filter anomalies by severity"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-transparent font-medium focus:outline-none cursor-pointer text-[#F6F0D5]"
          >
            <option value="ALL" className="bg-[#0D1826]">All Severities</option>
            <option value="High" className="bg-[#0D1826]">High Severity</option>
            <option value="Medium" className="bg-[#0D1826]">Medium Severity</option>
            <option value="Low" className="bg-[#0D1826]">Low / Advisory</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-[#132236]/90 border border-[#F6F0D5]/15 rounded-xl px-3 py-1.5 text-[#F6F0D5]">
          <label htmlFor="anomaly-status-filter" className="text-[#D9CEAA]/70">Status:</label>
          <select
            id="anomaly-status-filter"
            aria-label="Filter anomalies by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent font-medium focus:outline-none cursor-pointer text-[#F6F0D5]"
          >
            <option value="ALL" className="bg-[#0D1826]">All Resolution Statuses</option>
            <option value="Unresolved" className="bg-[#0D1826]">Unresolved</option>
            <option value="Investigating" className="bg-[#0D1826]">Investigating</option>
            <option value="Accepted with Justification" className="bg-[#0D1826]">Accepted Justification</option>
            <option value="Resolved" className="bg-[#0D1826]">Resolved</option>
          </select>
        </div>
      </div>

      {/* Anomaly Cards List */}
      <div className="space-y-4">
        {filteredAnomalies.length === 0 ? (
          <div className="bg-[#132236]/90 border border-[#F6F0D5]/15 rounded-2xl p-12 text-center text-xs text-[#D9CEAA]/60">
            No anomalies found matching the selected filters.
          </div>
        ) : (
          filteredAnomalies.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] space-y-4 hover:border-[#F6F0D5]/30 transition-colors text-[#F6F0D5]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F6F0D5]/15">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#F6F0D5] bg-[#0D1826] px-2 py-0.5 rounded border border-[#F6F0D5]/20">
                    {item.id}
                  </span>
                  {getSeverityBadge(item.severity)}
                  <span className="text-xs text-[#D9CEAA]/80">
                    Clause Ref: <strong className="font-mono text-[#F6F0D5]">{item.clause}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getResolutionBadge(item.resolutionStatus)}
                  <span className="text-[11px] text-[#D9CEAA]/60">{item.detectedAt}</span>
                </div>
              </div>

              {/* Anomaly Body */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="text-base font-semibold text-[#F6F0D5]">{item.title}</h3>
                  <button
                    onClick={() => onOpenApplication(item.applicationId)}
                    className="text-xs font-semibold text-[#F6F0D5] hover:underline flex items-center gap-1 cursor-pointer self-start"
                  >
                    <span>{item.institutionName}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D9CEAA]" />
                  </button>
                </div>

                <p className="text-xs text-[#D9CEAA] leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 rounded-xl bg-[#0D1826]/90 border border-[#F6F0D5]/15 text-xs font-mono text-[#D9CEAA] space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-[#F6F0D5]">Supporting Evidence:</div>
                  <div className="text-[11px] text-[#F6F0D5]">{item.evidence}</div>
                </div>

                {item.actionTaken && (
                  <div className="text-xs text-[#F6F0D5] bg-[#F6F0D5]/10 p-2.5 rounded-lg border border-[#F6F0D5]/20">
                    <span className="font-semibold">Action Note: </span>{item.actionTaken}
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F6F0D5]/15 text-xs">
                <span className="text-[11px] text-[#D9CEAA]/70">
                  Reviewer Decision for this Anomaly:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onResolveAnomaly(item.id, 'Investigating')}
                    className="px-3 py-1.5 rounded-lg border border-[#F6F0D5]/20 hover:bg-[#182B44] text-[#F6F0D5] font-medium transition-colors cursor-pointer"
                  >
                    Mark Investigating
                  </button>
                  <button
                    onClick={() => onResolveAnomaly(item.id, 'Accepted with Justification')}
                    className="px-3 py-1.5 rounded-lg border border-[#F6F0D5]/20 hover:bg-[#182B44] text-[#F6F0D5] font-medium transition-colors cursor-pointer"
                  >
                    Accept Justification
                  </button>
                  <button
                    onClick={() => onResolveAnomaly(item.id, 'Resolved')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F6F0D5] text-[#0F1B2C] font-semibold hover:bg-white transition-colors cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
