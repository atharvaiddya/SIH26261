export type ReviewStatus = 
  | 'Pending Scrutiny'
  | 'Under Review'
  | 'Action Required'
  | 'Approved'
  | 'Returned for Correction'
  | 'Escalated';

export type ApplicationType = 
  | 'Extension of Approval (EOA)'
  | 'New Technical Institution'
  | 'Increase in Approved Intake'
  | 'Introduction of Emerging Tech'
  | 'Closure / Site Relocation';

export type SeverityLevel = 'High' | 'Medium' | 'Low' | 'Advisory';

export interface ExtractedField {
  fieldName: string;
  extractedValue: string;
  prescribedNorm: string;
  status: 'Compliant' | 'Discrepancy' | 'Missing' | 'Unverified';
  confidence: number;
  clauseRef: string;
  pageNumber: number;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  category: 'Land & Legal' | 'Building & Safety' | 'Faculty & Cadre' | 'Finance & FDR' | 'Affiliation';
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Flagged' | 'Under Inspection' | 'Missing';
  ocrStatus: 'Processed (100% confidence)' | 'Needs Clarification' | 'Unreadable Seal';
  pages: number;
  previewUrl?: string;
  extractedFields: ExtractedField[];
  deficiencyNote?: string;
}

export interface ComplianceCheckItem {
  id: string;
  clause: string;
  category: string;
  requirement: string;
  institutionSubmitted: string;
  result: 'Compliant' | 'Deficit' | 'Reviewer Discretion' | 'Pending Verification';
  evidenceSource: string;
  notes?: string;
}

export interface AnomalyItem {
  id: string;
  applicationId: string;
  institutionName: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  evidence: string;
  clause: string;
  detectedAt: string;
  resolutionStatus: 'Unresolved' | 'Investigating' | 'Accepted with Justification' | 'Resolved';
  actionTaken?: string;
}

export interface ApplicationRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  region: 'Northern' | 'Southern' | 'Western' | 'Eastern' | 'Central' | 'South-Western' | 'North-West';
  state: string;
  applicationType: ApplicationType;
  program: 'Engineering & Technology' | 'Management' | 'MCA' | 'Pharmacy' | 'Architecture';
  appliedIntake: number;
  currentIntake: number;
  submissionDate: string;
  lastUpdated: string;
  status: ReviewStatus;
  assignedReviewer: string;
  reviewerRole: string;
  discrepancyCount: number;
  documents: VerificationDocument[];
  complianceChecks: ComplianceCheckItem[];
  reviewerNotes: string;
}

export interface ComplianceRule {
  id: string;
  code: string;
  name: string;
  category: string;
  aphChapter: string;
  version: string;
  description: string;
  prescribedThreshold: string;
  isActive: boolean;
  severityIfViolated: SeverityLevel;
  lastUpdated: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerName: string;
  officerRole: string;
  applicationId: string;
  action: string;
  details: string;
  ipAddress: string;
  hashSignature: string;
}
