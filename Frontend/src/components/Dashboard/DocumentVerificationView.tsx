import React, { useState } from 'react';
import { ApplicationRecord, VerificationDocument } from '../../types';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';

interface DocumentVerificationViewProps {
  applications: ApplicationRecord[];
  onOpenApplication: (app: ApplicationRecord) => void;
  searchQuery: string;
}

export const DocumentVerificationView: React.FC<DocumentVerificationViewProps> = ({
  applications,
  onOpenApplication,
  searchQuery,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const allDocuments = applications.flatMap((app) => 
    app.documents.map((doc) => ({
      ...doc,
      parentApp: app,
    }))
  );

  const filteredDocs = allDocuments.filter((doc) => {
    const matchesSearch = 
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.parentApp.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-[#F6F0D5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F6F0D5]/15">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif-editorial text-[#F6F0D5] tracking-tight">
            Document Scrutiny Repository
          </h1>
          <p className="text-xs sm:text-sm text-[#D9CEAA]/70 mt-0.5">
            Institutional evidentiary submissions under OCR parsing, structural verification, and seal analysis.
          </p>
        </div>
        <div className="text-xs text-[#D9CEAA]/70">
          Total Ingested: <span className="font-semibold text-[#F6F0D5]">{allDocuments.length} Documents</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-[#132236]/90 border border-[#F6F0D5]/15 rounded-xl px-3 py-1.5 text-[#F6F0D5]">
          <label htmlFor="doc-category-filter" className="text-[#D9CEAA]/70">Category:</label>
          <select
            id="doc-category-filter"
            aria-label="Filter documents by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent font-medium focus:outline-none cursor-pointer text-[#F6F0D5]"
          >
            <option value="ALL" className="bg-[#0D1826]">All Categories</option>
            <option value="Land & Legal" className="bg-[#0D1826]">Land & Legal</option>
            <option value="Building & Safety" className="bg-[#0D1826]">Building & Safety</option>
            <option value="Faculty & Cadre" className="bg-[#0D1826]">Faculty & Cadre</option>
            <option value="Finance & FDR" className="bg-[#0D1826]">Finance & FDR</option>
            <option value="Affiliation" className="bg-[#0D1826]">Affiliation</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-[#132236]/90 border border-[#F6F0D5]/15 rounded-xl px-3 py-1.5 text-[#F6F0D5]">
          <label htmlFor="doc-status-filter" className="text-[#D9CEAA]/70">Status:</label>
          <select
            id="doc-status-filter"
            aria-label="Filter documents by verification status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent font-medium focus:outline-none cursor-pointer text-[#F6F0D5]"
          >
            <option value="ALL" className="bg-[#0D1826]">All Statuses</option>
            <option value="Verified" className="bg-[#0D1826]">Verified</option>
            <option value="Flagged" className="bg-[#0D1826]">Flagged</option>
            <option value="Under Inspection" className="bg-[#0D1826]">Under Inspection</option>
          </select>
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#F6F0D5]">
            <thead className="bg-[#0D1826]/95 border-b border-[#F6F0D5]/15 text-[#D9CEAA]/80 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Document Name</th>
                <th className="py-3 px-5">Applicant Institution</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">OCR Pipeline</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0D5]/10">
              {filteredDocs.map((doc, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => onOpenApplication(doc.parentApp)}
                  className="hover:bg-[#182B44]/50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0D1826] text-[#F6F0D5] flex items-center justify-center shrink-0 border border-[#F6F0D5]/15">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#F6F0D5] font-mono">{doc.name}</div>
                        <div className="text-[11px] text-[#D9CEAA]/70">{doc.fileSize} • {doc.pages} Pages</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-medium text-[#F6F0D5]">{doc.parentApp.institutionName}</div>
                    <div className="text-[10px] text-[#D9CEAA]/60 font-mono">{doc.parentApp.id}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded bg-[#0D1826] text-[#F6F0D5] font-medium text-[11px] border border-[#F6F0D5]/15">
                      {doc.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-5">
                    <span className="text-[11px] text-[#D9CEAA]">{doc.ocrStatus}</span>
                  </td>

                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium ${
                      doc.status === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : doc.status === 'Flagged'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    }`}>
                      {doc.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                      {doc.status === 'Flagged' && <AlertTriangle className="w-3 h-3" />}
                      {doc.status === 'Under Inspection' && <Clock className="w-3 h-3" />}
                      <span>{doc.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenApplication(doc.parentApp);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F6F0D5] text-[#0F1B2C] hover:bg-white transition-colors cursor-pointer shadow-xs"
                    >
                      Open Dossier
                    </button>
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
