import React, { useState } from 'react';
import { ApplicationRecord, VerificationDocument, ReviewStatus } from '../../types';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle 
} from 'lucide-react';

interface ApplicationReviewViewProps {
  application: ApplicationRecord;
  onBack: () => void;
  onUpdateStatus: (appId: string, newStatus: ReviewStatus, notes: string) => void;
  officerName: string;
}

export const ApplicationReviewView: React.FC<ApplicationReviewViewProps> = ({
  application,
  onBack,
  onUpdateStatus,
  officerName,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    application.documents[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'checklist' | 'anomalies' | 'notes'>('checklist');
  const [reviewerNotes, setReviewerNotes] = useState<string>(application.reviewerNotes || '');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<ReviewStatus | null>(null);

  const selectedDoc: VerificationDocument | undefined = application.documents.find(
    (d) => d.id === selectedDocId
  ) || application.documents[0];

  const handleSaveNotes = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExecuteDecision = (status: ReviewStatus) => {
    onUpdateStatus(application.id, status, reviewerNotes);
    setConfirmAction(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-[#F6F0D5]">
      {/* Top Breadcrumb & Return Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F6F0D5]/15">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-[#F6F0D5]/20 hover:bg-[#182B44] text-[#F6F0D5] transition-colors cursor-pointer"
            title="Return to applications"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D9CEAA]/70">
              <span>Applications</span>
              <span>/</span>
              <span className="font-mono text-[#F6F0D5] font-semibold">{application.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif-editorial text-[#F6F0D5] tracking-tight">
              {application.institutionName}
            </h1>
          </div>
        </div>

        {/* Current Review Status & Officer Assignment */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-[#D9CEAA]/70">Assigned Reviewer</div>
            <div className="text-xs font-semibold text-[#F6F0D5]">{officerName}</div>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F6F0D5]/15 text-[#F6F0D5] border border-[#F6F0D5]/25">
            {application.status}
          </span>
        </div>
      </div>

      {/* INSTITUTION DETAILS STRIP */}
      <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
        <div>
          <div className="text-[#D9CEAA]/70 text-[11px]">AICTE Permanent ID</div>
          <div className="font-mono font-semibold text-[#F6F0D5] mt-0.5">{application.institutionId}</div>
        </div>
        <div>
          <div className="text-[#D9CEAA]/70 text-[11px]">Region & State</div>
          <div className="font-semibold text-[#F6F0D5] mt-0.5">{application.state} ({application.region})</div>
        </div>
        <div>
          <div className="text-[#D9CEAA]/70 text-[11px]">Application Type</div>
          <div className="font-semibold text-[#F6F0D5] mt-0.5">{application.applicationType}</div>
        </div>
        <div>
          <div className="text-[#D9CEAA]/70 text-[11px]">Program & Intake</div>
          <div className="font-semibold text-[#F6F0D5] mt-0.5">
            {application.program} ({application.appliedIntake} Seats)
          </div>
        </div>
        <div>
          <div className="text-[#D9CEAA]/70 text-[11px]">Discrepancies Detected</div>
          <div className="font-semibold text-amber-300 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{application.discrepancyCount} Flagged Items</span>
          </div>
        </div>
      </div>

      {/* ADVISORY BANNER */}
      <div className="p-3.5 rounded-xl bg-[#F6F0D5]/10 border border-[#F6F0D5]/25 text-[#F6F0D5] text-xs flex items-start gap-3 shadow-xs">
        <Sparkles className="w-4 h-4 text-[#F6F0D5] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">AICTE Statutory Protocol Notice: </span>
          AI-generated OCR extractions and cross-institution matches are strictly advisory. The final approval decision rests exclusively with the designated Scrutiny Officer and requires human verification of all evidentiary clauses.
        </div>
      </div>

      {/* SPLIT SCRUTINY WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER PANE: DOCUMENT SCRUTINY VIEWER */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Document Tabs */}
            <div className="p-3 border-b border-[#F6F0D5]/15 bg-[#0D1826]/95 flex items-center justify-between overflow-x-auto gap-2">
              <div className="flex items-center gap-1.5">
                {application.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      selectedDoc?.id === doc.id
                        ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold shadow-xs'
                        : 'bg-[#182B44] border border-[#F6F0D5]/15 text-[#D9CEAA]/80 hover:text-[#F6F0D5]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{doc.name.split('.')[0].replace(/_/g, ' ').slice(0, 20)}...</span>
                    {doc.status === 'Flagged' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Zoom controls */}
              <div className="hidden sm:flex items-center gap-1 text-[#D9CEAA]/80">
                <button 
                  onClick={() => setZoomLevel(z => Math.max(z - 10, 70))}
                  className="p-1 rounded hover:bg-[#182B44] text-[#F6F0D5] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono w-10 text-center text-[#F6F0D5]">{zoomLevel}%</span>
                <button 
                  onClick={() => setZoomLevel(z => Math.min(z + 10, 140))}
                  className="p-1 rounded hover:bg-[#182B44] text-[#F6F0D5] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Canvas */}
            <div className="p-6 bg-[#0B1420]/95 border-b border-[#F6F0D5]/15 min-h-[380px] flex items-center justify-center overflow-auto">
              {selectedDoc ? (
                <div 
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className="bg-[#132236] border border-[#F6F0D5]/25 rounded-xl shadow-2xl p-7 max-w-lg w-full space-y-5 transition-transform text-[#F6F0D5]"
                >
                  {/* Document Stamp Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#F6F0D5]/20">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#F6F0D5] text-[#0F1B2C] flex items-center justify-center font-bold text-xs">
                        GOI
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-[#F6F0D5] uppercase tracking-wider">
                          Official Institutional Submission
                        </div>
                        <div className="text-[10px] text-[#D9CEAA]/70">{selectedDoc.name}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0D1826] text-[#F6F0D5] border border-[#F6F0D5]/20">
                      {selectedDoc.ocrStatus}
                    </span>
                  </div>

                  {/* Document Body */}
                  <div className="space-y-3 text-xs text-[#F6F0D5]/90 font-serif leading-relaxed">
                    <p className="font-semibold text-sm text-[#F6F0D5]">
                      SUBMISSION MEMORANDUM & VERIFICATION SCHEDULE
                    </p>
                    <p className="text-[#D9CEAA]">
                      In reference to AICTE Approval Process Handbook (APH 2026-27), the undersigned institution confirms the submission of statutory records for scrutiny.
                    </p>

                    {/* Highlighted OCR extraction target */}
                    <div className="p-3 rounded-lg bg-[#0D1826]/90 border-l-4 border-[#F6F0D5] text-xs font-sans">
                      <div className="font-semibold text-[#F6F0D5] flex items-center justify-between">
                        <span>OCR Extracted Clauses ({selectedDoc.category})</span>
                        <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono border border-emerald-400/30">
                          99.2% Confidence
                        </span>
                      </div>
                      <div className="mt-2 space-y-1.5 text-[11px] text-[#F6F0D5]">
                        {selectedDoc.extractedFields.map((f, i) => (
                          <div key={i} className="flex justify-between items-baseline py-0.5 border-b border-[#F6F0D5]/10 last:border-0">
                            <span className="text-[#D9CEAA]/70">{f.fieldName}:</span>
                            <span className={`font-semibold ${
                              f.status === 'Compliant' ? 'text-emerald-300' : 'text-amber-300'
                            }`}>
                              {f.extractedValue} ({f.clauseRef})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedDoc.deficiencyNote && (
                      <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-sans flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Deficiency Flag: </span>
                          {selectedDoc.deficiencyNote}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stamp & Seal Footer */}
                  <div className="pt-3 border-t border-dashed border-[#F6F0D5]/20 flex items-center justify-between text-[10px] text-[#D9CEAA]/70 font-sans">
                    <div>Digital Timestamp: 2026-02-14 11:28:40 IST</div>
                    <div className="font-mono text-[#F6F0D5]">Pages: {selectedDoc.pages} | {selectedDoc.fileSize}</div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Extracted Fields Table */}
            <div className="p-5">
              <h3 className="text-xs font-semibold text-[#F6F0D5] uppercase tracking-wider mb-3">
                Extracted Values vs. AICTE Prescribed Norms
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D1826]/90 border-y border-[#F6F0D5]/15 text-[#D9CEAA]/70 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">Field Name</th>
                      <th className="py-2 px-3">Extracted Value</th>
                      <th className="py-2 px-3">APH Norm</th>
                      <th className="py-2 px-3">Ref Clause</th>
                      <th className="py-2 px-3 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F6F0D5]/10">
                    {selectedDoc?.extractedFields.map((field, idx) => (
                      <tr key={idx} className="hover:bg-[#182B44]/50">
                        <td className="py-2.5 px-3 font-medium text-[#F6F0D5]">{field.fieldName}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#F6F0D5]">{field.extractedValue}</td>
                        <td className="py-2.5 px-3 text-[#D9CEAA]/70">{field.prescribedNorm}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#D9CEAA]/70">{field.clauseRef}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            field.status === 'Compliant'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}>
                            {field.status === 'Compliant' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-amber-300" />
                            )}
                            <span>{field.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: COMPLIANCE CHECKLIST & ACTIONS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-4">
            <div className="flex items-center gap-1 p-1 bg-[#0D1826]/90 rounded-xl border border-[#F6F0D5]/15 mb-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('checklist')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === 'checklist' ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold shadow-xs' : 'text-[#D9CEAA]/80 hover:text-[#F6F0D5]'
                }`}
              >
                Checklist
              </button>
              <button
                onClick={() => setActiveTab('anomalies')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === 'anomalies' ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold shadow-xs' : 'text-[#D9CEAA]/80 hover:text-[#F6F0D5]'
                }`}
              >
                Discrepancies ({application.discrepancyCount})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === 'notes' ? 'bg-[#F6F0D5] text-[#0F1B2C] font-semibold shadow-xs' : 'text-[#D9CEAA]/80 hover:text-[#F6F0D5]'
                }`}
              >
                Notes
              </button>
            </div>

            {/* TAB CONTENT: Checklist */}
            {activeTab === 'checklist' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#D9CEAA]/70 pb-2 border-b border-[#F6F0D5]/15">
                  <span>AICTE APH Clause Checks</span>
                  <span className="font-semibold text-[#F6F0D5]">
                    {application.complianceChecks.filter(c => c.result === 'Compliant').length} / {application.complianceChecks.length} Passed
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {application.complianceChecks.map((chk) => (
                    <div 
                      key={chk.id}
                      className="p-3 rounded-xl border border-[#F6F0D5]/15 bg-[#0D1826]/90 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-[11px] text-[#F6F0D5] bg-[#182B44] px-2 py-0.5 rounded border border-[#F6F0D5]/15">
                          {chk.clause}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          chk.result === 'Compliant'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : chk.result === 'Deficit'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        }`}>
                          {chk.result}
                        </span>
                      </div>
                      <div className="font-semibold text-[#F6F0D5]">{chk.requirement}</div>
                      <div className="text-[#D9CEAA]/70 text-[11px]">Submitted: {chk.institutionSubmitted}</div>
                      <div className="text-[10px] text-[#D9CEAA]/50 font-mono italic">
                        Source: {chk.evidenceSource}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Discrepancies */}
            {activeTab === 'anomalies' && (
              <div className="space-y-3">
                <div className="text-xs text-[#D9CEAA]/70 pb-2 border-b border-[#F6F0D5]/15">
                  Identified Irregularities & Deficiencies
                </div>

                {application.documents.filter(d => d.deficiencyNote).map((d) => (
                  <div key={d.id} className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs space-y-2">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>{d.category} Deficiency</span>
                      <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded font-mono border border-amber-400/30">
                        Requires Correction
                      </span>
                    </div>
                    <p className="text-[#F6F0D5] text-xs leading-relaxed">
                      {d.deficiencyNote}
                    </p>
                    <div className="text-[10px] text-[#D9CEAA]/70 font-mono">
                      Document: {d.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="text-xs text-[#D9CEAA]/70 pb-2 border-b border-[#F6F0D5]/15">
                  Officer Scrutiny Minute & Remarks
                </div>
                <textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  rows={6}
                  placeholder="Enter official scrutiny findings, clauses invoked, and conditions..."
                  className="w-full p-3 text-xs bg-[#0D1826]/90 border border-[#F6F0D5]/20 rounded-xl text-[#F6F0D5] focus:outline-none focus:border-[#F6F0D5] focus:ring-1 focus:ring-[#F6F0D5] leading-relaxed placeholder-[#D9CEAA]/40"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#D9CEAA]/70">
                    {isSaved ? '✓ Saved to scrutiny ledger' : 'Changes tracked live'}
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F6F0D5] text-[#0F1B2C] hover:bg-white transition-colors cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACTION CONSOLE */}
          <div className="bg-[#132236]/90 backdrop-blur-md border border-[#F6F0D5]/15 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-5 space-y-3">
            <h3 className="text-xs font-semibold text-[#F6F0D5] uppercase tracking-wider mb-2">
              Official Scrutiny Actions
            </h3>
            <p className="text-xs text-[#D9CEAA]/70 leading-relaxed mb-4">
              Executing an official action will register a tamper-evident audit record and dispatch notifications.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setConfirmAction('Approved')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#F6F0D5] text-[#0F1B2C] hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#0F1B2C]" />
                <span>Approve Institutional Application</span>
              </button>

              <button
                onClick={() => setConfirmAction('Returned for Correction')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#182B44] text-[#F6F0D5] border border-[#F6F0D5]/20 hover:bg-[#203756] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#D9CEAA]" />
                <span>Return for Correction (Deficiency Memo)</span>
              </button>

              <button
                onClick={() => setConfirmAction('Escalated')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30 hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Escalate to Regional Standing Committee</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070D16]/80 backdrop-blur-xs">
          <div className="bg-[#132236] border border-[#F6F0D5]/25 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in text-left text-[#F6F0D5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F0D5] text-[#0F1B2C] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#F6F0D5]">
                  Confirm Action: {confirmAction}
                </h4>
                <p className="text-xs text-[#D9CEAA]/70">{application.institutionName}</p>
              </div>
            </div>

            <p className="text-xs text-[#F6F0D5]/90 leading-relaxed">
              Are you sure you want to mark this application as <strong className="text-[#F6F0D5] underline">{confirmAction}</strong>? This decision will be stamped with your officer credentials ({officerName}) and written to the immutable audit trail.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#D9CEAA]/80 hover:bg-[#0D1826] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteDecision(confirmAction)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#F6F0D5] text-[#0F1B2C] hover:bg-white transition-colors cursor-pointer"
              >
                Sign & Execute Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
