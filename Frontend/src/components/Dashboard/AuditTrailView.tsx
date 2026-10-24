import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { 
  Download, 
  Lock, 
  KeyRound 
} from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
  searchQuery: string;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  logs,
  searchQuery,
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      !searchQuery ||
      log.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hashSignature.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = 
      filterAction === 'ALL' ||
      (filterAction === 'APPROVAL' && log.action.includes('Approved')) ||
      (filterAction === 'ESCALATION' && log.action.includes('Escalated')) ||
      (filterAction === 'DEFICIENCY' && log.action.includes('Deficiency'));

    return matchesSearch && matchesAction;
  });

  const handleExportAudit = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SETU_AICTE_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-[#F6F0D5]">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F6F0D5]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif-editorial text-[#F6F0D5] tracking-tight">
            Immutable Audit Trail & Regulatory Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CEAA]/70 mt-0.5">
            Cryptographically sealed chronological log of scrutiny decisions, officer interventions, and status changes.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F6F0D5] text-[#0F1B2C] hover:bg-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#0F1B2C]" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Security Status Box */}
      <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F6F0D5] text-[#0F1B2C] flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#F6F0D5]">
              Tamper-Resistant SHA-256 State Anchoring
            </div>
            <div className="text-[11px] text-[#D9CEAA]/70">
              Each entry records designated officer token, NIC VPN IP address, and payload hash.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#D9CEAA]/70">Quick filter:</span>
          <button
            onClick={() => setFilterAction('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
              filterAction === 'ALL' ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold' : 'bg-[#0D1826] border border-[#F6F0D5]/15 text-[#D9CEAA]/80'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterAction('APPROVAL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
              filterAction === 'APPROVAL' ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold' : 'bg-[#0D1826] border border-[#F6F0D5]/15 text-[#D9CEAA]/80'
            }`}
          >
            Approvals
          </button>
          <button
            onClick={() => setFilterAction('ESCALATION')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
              filterAction === 'ESCALATION' ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold' : 'bg-[#0D1826] border border-[#F6F0D5]/15 text-[#D9CEAA]/80'
            }`}
          >
            Escalations
          </button>
        </div>
      </div>

      {/* Chronological Audit Table */}
      <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1826]/95 border-b border-[#F6F0D5]/15 text-[#D9CEAA]/80 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Timestamp & ID</th>
                <th className="py-3 px-5">Scrutiny Officer</th>
                <th className="py-3 px-5">Action & Target App</th>
                <th className="py-3 px-5">Verification Detail</th>
                <th className="py-3 px-5">Cryptographic Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0D5]/10">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#182B44]/50 transition-colors">
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="font-mono text-[#F6F0D5] font-semibold">{log.timestamp}</div>
                    <div className="text-[10px] text-[#D9CEAA]/60 font-mono">{log.id}</div>
                  </td>

                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="font-semibold text-[#F6F0D5]">{log.officerName}</div>
                    <div className="text-[10px] text-[#D9CEAA]/70">{log.officerRole}</div>
                    <div className="text-[10px] text-[#D9CEAA]/50 font-mono">{log.ipAddress}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-[#F6F0D5]">{log.action}</div>
                    <div className="text-[11px] font-mono text-[#D9CEAA]/70">{log.applicationId}</div>
                  </td>

                  <td className="py-3.5 px-5 max-w-sm text-[#D9CEAA] leading-relaxed">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#D9CEAA]/80 bg-[#0D1826] px-2 py-1 rounded border border-[#F6F0D5]/15 max-w-xs truncate" title={log.hashSignature}>
                      <KeyRound className="w-3 h-3 text-[#F6F0D5] shrink-0" />
                      <span className="truncate">{log.hashSignature.slice(0, 24)}...</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
