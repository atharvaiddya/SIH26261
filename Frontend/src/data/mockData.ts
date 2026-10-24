import { ApplicationRecord, ComplianceRule, AnomalyItem, AuditLogEntry } from '../types';

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'APP-2026-AICTE-0842',
    institutionId: '1-4392817291',
    institutionName: 'Apex Institute of Technology & Advanced Studies',
    region: 'Western',
    state: 'Maharashtra',
    applicationType: 'Increase in Approved Intake',
    program: 'Engineering & Technology',
    appliedIntake: 420,
    currentIntake: 300,
    submissionDate: '2026-02-14',
    lastUpdated: '2026-03-02',
    status: 'Action Required',
    assignedReviewer: 'Dr. Ramanathan S.',
    reviewerRole: 'Senior Scrutiny Officer (RO Mumbai)',
    discrepancyCount: 2,
    reviewerNotes: 'Faculty cadre ratio in Dept of Computer Science fails AICTE APH Clause 5.2. Land title deed verified compliant with 7.5 contiguous acres.',
    documents: [
      {
        id: 'DOC-01',
        name: 'Land_Title_Sale_Deed_Khasra_84.pdf',
        type: 'PDF',
        category: 'Land & Legal',
        fileSize: '14.2 MB',
        uploadDate: '2026-02-14',
        status: 'Verified',
        ocrStatus: 'Processed (100% confidence)',
        pages: 34,
        extractedFields: [
          { fieldName: 'Contiguous Land Area', extractedValue: '7.50 Acres', prescribedNorm: 'Min 5.0 Acres (Non-Metro)', status: 'Compliant', confidence: 0.99, clauseRef: 'APH Sec 4.1', pageNumber: 4 },
          { fieldName: 'Land Ownership Type', extractedValue: 'Clear Title (Freehold)', prescribedNorm: 'Freehold or 30-year Govt Lease', status: 'Compliant', confidence: 0.98, clauseRef: 'APH Sec 4.2', pageNumber: 6 },
          { fieldName: 'Non-Encumbrance Certificate', extractedValue: 'Valid up to 2050 (Sub-Registrar)', prescribedNorm: 'Current & Unencumbered', status: 'Compliant', confidence: 0.96, clauseRef: 'APH Sec 4.4', pageNumber: 12 },
        ]
      },
      {
        id: 'DOC-02',
        name: 'Fire_Safety_NOC_Chief_Fire_Officer.pdf',
        type: 'PDF',
        category: 'Building & Safety',
        fileSize: '4.8 MB',
        uploadDate: '2026-02-14',
        status: 'Flagged',
        ocrStatus: 'Needs Clarification',
        pages: 8,
        deficiencyNote: 'Certificate expired on 15-Jan-2026. Renewal receipt dated 02-Feb-2026 attached without Chief Fire Officer endorsement.',
        extractedFields: [
          { fieldName: 'NOC Validity Date', extractedValue: '15-Jan-2026 (Expired)', prescribedNorm: 'Valid on scrutiny date', status: 'Discrepancy', confidence: 0.94, clauseRef: 'APH Sec 6.1', pageNumber: 2 },
          { fieldName: 'Fire Sprinkler Coverage', extractedValue: 'Installed (Labs & Seminar)', prescribedNorm: 'All Academic Blocks', status: 'Compliant', confidence: 0.92, clauseRef: 'NBC 2016 Part 4', pageNumber: 5 },
        ]
      },
      {
        id: 'DOC-03',
        name: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf',
        type: 'PDF',
        category: 'Faculty & Cadre',
        fileSize: '8.1 MB',
        uploadDate: '2026-02-15',
        status: 'Flagged',
        ocrStatus: 'Processed (100% confidence)',
        pages: 42,
        deficiencyNote: 'Cadre ratio deficit: Applied for 420 intake requires 3 Professors in CSE. Only 1 Professor on regular appointment roster.',
        extractedFields: [
          { fieldName: 'Faculty Student Ratio (FSR)', extractedValue: '1 : 16.2', prescribedNorm: '1 : 15 (Engineering UG)', status: 'Discrepancy', confidence: 0.97, clauseRef: 'APH Sec 5.1', pageNumber: 18 },
          { fieldName: 'Cadre Ratio (Prof:Assoc:Asst)', extractedValue: '1 : 2 : 14 (CSE)', prescribedNorm: '1 : 2 : 6', status: 'Discrepancy', confidence: 0.95, clauseRef: 'APH Sec 5.2', pageNumber: 19 },
          { fieldName: 'Biometric Attendance Integration', extractedValue: 'Live linked to University', prescribedNorm: 'Mandatory', status: 'Compliant', confidence: 0.99, clauseRef: 'APH Sec 5.7', pageNumber: 31 },
        ]
      },
      {
        id: 'DOC-04',
        name: 'Joint_FDR_Security_AICTE_RO.pdf',
        type: 'PDF',
        category: 'Finance & FDR',
        fileSize: '2.4 MB',
        uploadDate: '2026-02-14',
        status: 'Verified',
        ocrStatus: 'Processed (100% confidence)',
        pages: 4,
        extractedFields: [
          { fieldName: 'Joint FDR Value', extractedValue: '₹1,50,00,000/-', prescribedNorm: '₹1.50 Crore', status: 'Compliant', confidence: 0.99, clauseRef: 'APH Sec 8.1', pageNumber: 1 },
          { fieldName: 'Lien in favour of Regional Officer', extractedValue: 'Confirmed (SBI Mumbai Main)', prescribedNorm: 'RO AICTE Joint Account', status: 'Compliant', confidence: 0.98, clauseRef: 'APH Sec 8.2', pageNumber: 2 },
        ]
      }
    ],
    complianceChecks: [
      { id: 'CHK-1', clause: 'APH 4.1', category: 'Land Norms', requirement: 'Contiguous land area min 5 acres (Urban/Town)', institutionSubmitted: '7.50 contiguous acres', result: 'Compliant', evidenceSource: 'Land_Title_Sale_Deed_Khasra_84.pdf, Page 4' },
      { id: 'CHK-2', clause: 'APH 5.1', category: 'Cadre Ratio', requirement: 'Faculty-student ratio 1:15 in Engineering UG', institutionSubmitted: '1:16.2 overall, 1:17.1 in CSE', result: 'Deficit', evidenceSource: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf, Page 18', notes: 'Shortage of 4 full-time faculties' },
      { id: 'CHK-3', clause: 'APH 5.2', category: 'Faculty Cadre', requirement: 'Cadre ratio 1:2:6 per program division', institutionSubmitted: '1 Professor, 2 Associate, 14 Assistant in CSE', result: 'Deficit', evidenceSource: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf, Page 19', notes: 'Deficit of 2 Professors' },
      { id: 'CHK-4', clause: 'APH 6.1', category: 'Safety & Hygiene', requirement: 'Valid Fire NOC issued by Competent Govt Authority', institutionSubmitted: 'Expired Jan 2026, provisional renewal receipt', result: 'Reviewer Discretion', evidenceSource: 'Fire_Safety_NOC_Chief_Fire_Officer.pdf, Page 2' },
      { id: 'CHK-5', clause: 'APH 7.3', category: 'Barrier-Free Access', requirement: 'Lifts, accessible washrooms, ramps for PWD as per NBC 2016', institutionSubmitted: 'Architectural certificate with 2 lifts + ramps in block A, B', result: 'Compliant', evidenceSource: 'Architect_Barrier_Free_Certificate.pdf, Page 3' },
      { id: 'CHK-6', clause: 'APH 8.1', category: 'Financial Viability', requirement: 'Joint Fixed Deposit with AICTE RO lien', institutionSubmitted: '₹1.50 Crore SBI Bank FDR with AICTE RO Western lien', result: 'Compliant', evidenceSource: 'Joint_FDR_Security_AICTE_RO.pdf, Page 1' },
    ]
  },
  {
    id: 'APP-2026-AICTE-1109',
    institutionId: '1-9382103982',
    institutionName: 'Coimbatore Institute of Engineering & Robotics',
    region: 'Southern',
    state: 'Tamil Nadu',
    applicationType: 'Introduction of Emerging Tech',
    program: 'Engineering & Technology',
    appliedIntake: 60,
    currentIntake: 240,
    submissionDate: '2026-02-18',
    lastUpdated: '2026-03-01',
    status: 'Pending Scrutiny',
    assignedReviewer: 'Er. Sunita Deshmukh',
    reviewerRole: 'Scrutiny Officer (RO Chennai)',
    discrepancyCount: 0,
    reviewerNotes: 'New course application for B.Tech Artificial Intelligence & Machine Learning (60 seats). Laboratory equipment invoices submitted.',
    documents: [
      {
        id: 'DOC-11',
        name: 'Lab_Infrastructure_AI_GPU_Invoices.pdf',
        type: 'PDF',
        category: 'Building & Safety',
        fileSize: '6.7 MB',
        uploadDate: '2026-02-18',
        status: 'Verified',
        ocrStatus: 'Processed (100% confidence)',
        pages: 16,
        extractedFields: [
          { fieldName: 'High-Performance Workstations', extractedValue: '40 Units (NVIDIA RTX)', prescribedNorm: 'Min 30 Units for 60 batch', status: 'Compliant', confidence: 0.99, clauseRef: 'APH Sec 6.4', pageNumber: 3 },
          { fieldName: 'Licensed Software / Open Source Frameworks', extractedValue: 'CUDA, PyTorch, ROS2', prescribedNorm: 'Mandatory AI Labs', status: 'Compliant', confidence: 0.97, clauseRef: 'APH Sec 6.5', pageNumber: 7 },
        ]
      },
      {
        id: 'DOC-12',
        name: 'University_Affiliation_Approval_AnnaUniv.pdf',
        type: 'PDF',
        category: 'Affiliation',
        fileSize: '3.1 MB',
        uploadDate: '2026-02-18',
        status: 'Verified',
        ocrStatus: 'Processed (100% confidence)',
        pages: 6,
        extractedFields: [
          { fieldName: 'Affiliating University Consent', extractedValue: 'Approved for 2026-27', prescribedNorm: 'Mandatory NOC', status: 'Compliant', confidence: 0.98, clauseRef: 'APH Sec 3.2', pageNumber: 1 },
        ]
      }
    ],
    complianceChecks: [
      { id: 'CHK-11', clause: 'APH 3.2', category: 'Affiliation', requirement: 'Affiliating University NOC for emerging branch', institutionSubmitted: 'Anna University Syndicate Resolution NOC dated Jan 2026', result: 'Compliant', evidenceSource: 'University_Affiliation_Approval_AnnaUniv.pdf, Page 1' },
      { id: 'CHK-12', clause: 'APH 6.4', category: 'Lab Norms', requirement: 'Dedicated computing lab for AI/ML with GPU clusters', institutionSubmitted: '40 high-performance GPU workstations with 1 Gbps lease line', result: 'Compliant', evidenceSource: 'Lab_Infrastructure_AI_GPU_Invoices.pdf, Page 3' },
    ]
  },
  {
    id: 'APP-2026-AICTE-0941',
    institutionId: '1-8492019482',
    institutionName: 'Gurugram School of Management & Technology',
    region: 'North-West',
    state: 'Haryana',
    applicationType: 'Extension of Approval (EOA)',
    program: 'Management',
    appliedIntake: 180,
    currentIntake: 180,
    submissionDate: '2026-02-10',
    lastUpdated: '2026-02-28',
    status: 'Approved',
    assignedReviewer: 'Prof. K. Venkatesh',
    reviewerRole: 'Principal Scrutiny Officer',
    discrepancyCount: 0,
    reviewerNotes: 'EOA 2026-27 validated. All 18 compliance parameters conform to APH Chapter II norms without deficiencies.',
    documents: [
      {
        id: 'DOC-21',
        name: 'EOA_Annual_Self_Disclosure_2026.pdf',
        type: 'PDF',
        category: 'Land & Legal',
        fileSize: '12.0 MB',
        uploadDate: '2026-02-10',
        status: 'Verified',
        ocrStatus: 'Processed (100% confidence)',
        pages: 58,
        extractedFields: [
          { fieldName: 'Total Built-up Area', extractedValue: '18,450 sq.m.', prescribedNorm: 'Min 12,000 sq.m.', status: 'Compliant', confidence: 0.99, clauseRef: 'APH Sec 4.3', pageNumber: 11 },
          { fieldName: 'Library Digital Subscriptions', extractedValue: 'EBSCO, ProQuest, Harvard Cases', prescribedNorm: 'Min 2 Digital Packages', status: 'Compliant', confidence: 0.99, clauseRef: 'APH Sec 6.8', pageNumber: 24 },
        ]
      }
    ],
    complianceChecks: [
      { id: 'CHK-21', clause: 'APH 4.3', category: 'Built-up Area', requirement: 'Built up instructional area >= 12,000 sq.m.', institutionSubmitted: '18,450 sq.m. verified through municipal occupancy certificate', result: 'Compliant', evidenceSource: 'EOA_Annual_Self_Disclosure_2026.pdf, Page 11' },
      { id: 'CHK-22', clause: 'APH 5.1', category: 'FSR Management', requirement: 'FSR 1:20 for PGDM / MBA programs', institutionSubmitted: '1:14.5 with 14 full-time PhD doctorates', result: 'Compliant', evidenceSource: 'EOA_Annual_Self_Disclosure_2026.pdf, Page 19' },
    ]
  },
  {
    id: 'APP-2026-AICTE-1340',
    institutionId: '1-7482910394',
    institutionName: 'Deccan Polytechnic & Technical Campus',
    region: 'South-Western',
    state: 'Karnataka',
    applicationType: 'Extension of Approval (EOA)',
    program: 'Engineering & Technology',
    appliedIntake: 240,
    currentIntake: 240,
    submissionDate: '2026-02-22',
    lastUpdated: '2026-03-03',
    status: 'Escalated',
    assignedReviewer: 'Dr. Ramanathan S.',
    reviewerRole: 'Senior Scrutiny Officer (RO Mumbai)',
    discrepancyCount: 3,
    reviewerNotes: 'Escalated to Standing Complaint Committee: Potential ghost faculty detected. 2 faculty members registered simultaneously at an Andhra Pradesh institution.',
    documents: [
      {
        id: 'DOC-31',
        name: 'Faculty_Declaration_Forms_Affidavit.pdf',
        type: 'PDF',
        category: 'Faculty & Cadre',
        fileSize: '15.4 MB',
        uploadDate: '2026-02-22',
        status: 'Flagged',
        ocrStatus: 'Needs Clarification',
        pages: 64,
        deficiencyNote: 'Aadhaar ID cross-match flagged duplicate employment for Prof. M. Suresh and Asst. Prof. Priya Nair.',
        extractedFields: [
          { fieldName: 'Cross-Institutional Faculty Match', extractedValue: 'Duplicate Found (SVEC Tirupati)', prescribedNorm: 'Single Exclusive Employment', status: 'Discrepancy', confidence: 0.99, clauseRef: 'APH Sec 5.8', pageNumber: 12 },
        ]
      }
    ],
    complianceChecks: [
      { id: 'CHK-31', clause: 'APH 5.8', category: 'Faculty Integrity', requirement: 'Exclusive full-time regular employment with single AICTE institute', institutionSubmitted: 'Aadhaar duplicate recorded across 2 institutions', result: 'Deficit', evidenceSource: 'Faculty_Declaration_Forms_Affidavit.pdf, Page 12', notes: 'Severe violation: Hearing notice initiated' }
    ]
  },
  {
    id: 'APP-2026-AICTE-1422',
    institutionId: '1-6382019482',
    institutionName: 'Kolkata Metropolitan Institute of Science & Research',
    region: 'Eastern',
    state: 'West Bengal',
    applicationType: 'New Technical Institution',
    program: 'Engineering & Technology',
    appliedIntake: 360,
    currentIntake: 0,
    submissionDate: '2026-02-25',
    lastUpdated: '2026-03-02',
    status: 'Under Review',
    assignedReviewer: 'Er. Sunita Deshmukh',
    reviewerRole: 'Scrutiny Officer (RO Chennai)',
    discrepancyCount: 1,
    reviewerNotes: 'New institution scrutiny under Chapter I of APH. Land conversion certificate pending verification with District Collectorate portal.',
    documents: [
      {
        id: 'DOC-41',
        name: 'Land_Conversion_Order_Govt_WB.pdf',
        type: 'PDF',
        category: 'Land & Legal',
        fileSize: '5.2 MB',
        uploadDate: '2026-02-25',
        status: 'Under Inspection',
        ocrStatus: 'Needs Clarification',
        pages: 12,
        deficiencyNote: 'Digital QR on state revenue order requires live API ping confirmation from BanglarBhumi database.',
        extractedFields: [
          { fieldName: 'Land Use Conversion', extractedValue: 'Institutional Use Permitted', prescribedNorm: 'Educational / Institutional Classification', status: 'Unverified', confidence: 0.88, clauseRef: 'APH Sec 4.2', pageNumber: 3 }
        ]
      }
    ],
    complianceChecks: [
      { id: 'CHK-41', clause: 'APH 4.2', category: 'Land Norms', requirement: 'Statutory government land use conversion order', institutionSubmitted: 'Order No. 492/LR/2025 submitted, QR pending API handshake', result: 'Pending Verification', evidenceSource: 'Land_Conversion_Order_Govt_WB.pdf, Page 3' }
    ]
  },
  {
    id: 'APP-2026-AICTE-0711',
    institutionId: '1-5291039481',
    institutionName: 'Indira Memorial College of Pharmacy',
    region: 'Central',
    state: 'Madhya Pradesh',
    applicationType: 'Extension of Approval (EOA)',
    program: 'Pharmacy',
    appliedIntake: 100,
    currentIntake: 100,
    submissionDate: '2026-02-05',
    lastUpdated: '2026-02-20',
    status: 'Returned for Correction',
    assignedReviewer: 'Prof. K. Venkatesh',
    reviewerRole: 'Principal Scrutiny Officer',
    discrepancyCount: 2,
    reviewerNotes: 'Returned to applicant for missing Animal House approval certificate (CPCSEA) and Pharmacognosy lab gas line safety certificate.',
    documents: [
      {
        id: 'DOC-51',
        name: 'PCI_Approval_and_CPCSEA_Letter.pdf',
        type: 'PDF',
        category: 'Building & Safety',
        fileSize: '3.9 MB',
        uploadDate: '2026-02-05',
        status: 'Flagged',
        ocrStatus: 'Needs Clarification',
        pages: 9,
        deficiencyNote: 'CPCSEA clearance letter expired in Dec 2025. Animal house inspection report missing.',
        extractedFields: [
          { fieldName: 'CPCSEA Registration', extractedValue: 'Expired 31-Dec-2025', prescribedNorm: 'Valid CPCSEA certification for B.Pharm', status: 'Discrepancy', confidence: 0.96, clauseRef: 'PCI / APH Norms', pageNumber: 4 }
        ]
      }
    ],
    complianceChecks: [
      { id: 'CHK-51', clause: 'APH 6.9', category: 'Pharmacy Lab Norms', requirement: 'CPCSEA approval for animal house and bio-waste disposal', institutionSubmitted: 'Expired certificate submitted', result: 'Deficit', evidenceSource: 'PCI_Approval_and_CPCSEA_Letter.pdf, Page 4' }
    ]
  }
];

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'RULE-01',
    code: 'APH-2026-4.1',
    name: 'Minimum Contiguous Land Norm',
    category: 'Land & Legal',
    aphChapter: 'Chapter IV: Infrastructure Norms',
    version: '2026.1 (APH Gazetted)',
    description: 'Institution must possess required contiguous land area in title or registered lease (>=30 yrs) free from legal encumbrance, without intervening public roads.',
    prescribedThreshold: '>= 5.0 Acres (Non-Metro) / >= 2.5 Acres (Metro)',
    isActive: true,
    severityIfViolated: 'High',
    lastUpdated: '2026-01-15'
  },
  {
    id: 'RULE-02',
    code: 'APH-2026-5.1',
    name: 'Faculty-to-Student Ratio (FSR)',
    category: 'Faculty & Cadre',
    aphChapter: 'Chapter V: Norms for Faculty Requirements',
    version: '2026.1 (APH Gazetted)',
    description: 'Institutions offering undergraduate engineering degrees must maintain prescribed full-time faculty to student headcount ratio.',
    prescribedThreshold: '1 : 15 (Undergraduate Engineering & Tech)',
    isActive: true,
    severityIfViolated: 'High',
    lastUpdated: '2026-01-15'
  },
  {
    id: 'RULE-03',
    code: 'APH-2026-5.2',
    name: 'Cadre Structure Compliance',
    category: 'Faculty & Cadre',
    aphChapter: 'Chapter V: Faculty Cadre Proportions',
    version: '2026.1 (APH Gazetted)',
    description: 'For each department/division, faculty must be balanced in the ratio of Professor : Associate Professor : Assistant Professor with UGC/AICTE minimum qualifications.',
    prescribedThreshold: '1 : 2 : 6 (Cadre Distribution)',
    isActive: true,
    severityIfViolated: 'Medium',
    lastUpdated: '2026-01-15'
  },
  {
    id: 'RULE-04',
    code: 'APH-2026-6.1',
    name: 'Statutory Fire & Life Safety Certificate',
    category: 'Building & Safety',
    aphChapter: 'Chapter VI: Building & Life Safety Mandates',
    version: '2026.2 (Updated Safety Directive)',
    description: 'Valid Fire Safety NOC issued by State Chief Fire Officer or Municipal Authority covering academic, administrative, and hostel buildings.',
    prescribedThreshold: 'Valid & active on the date of approval scrutiny',
    isActive: true,
    severityIfViolated: 'High',
    lastUpdated: '2026-02-01'
  },
  {
    id: 'RULE-05',
    code: 'APH-2026-7.3',
    name: 'Barrier-Free Physical Environment (PWD)',
    category: 'Building & Safety',
    aphChapter: 'Chapter VII: Essential Amenities',
    version: '2026.1 (APH Gazetted)',
    description: 'As per RPwD Act 2016, campus must provide dedicated wheelchair ramps, accessible elevators with braille indicators, and uni-sex disabled washrooms.',
    prescribedThreshold: '100% Academic & Administrative Block Compliance',
    isActive: true,
    severityIfViolated: 'Medium',
    lastUpdated: '2026-01-15'
  },
  {
    id: 'RULE-06',
    code: 'APH-2026-8.1',
    name: 'Joint Fixed Deposit Security (Security Deposit)',
    category: 'Finance & FDR',
    aphChapter: 'Chapter VIII: Financial Viability Norms',
    version: '2026.1 (APH Gazetted)',
    description: 'Joint FDR in scheduled commercial bank with Regional Officer AICTE for statutory security deposit tenure (minimum 10 years).',
    prescribedThreshold: '₹1.50 Crore (Engg UG) / ₹1.00 Crore (PGDM)',
    isActive: true,
    severityIfViolated: 'High',
    lastUpdated: '2026-01-15'
  },
  {
    id: 'RULE-07',
    code: 'APH-2026-5.8',
    name: 'Single Full-Time Employment Verification',
    category: 'Faculty & Cadre',
    aphChapter: 'Chapter V: Integrity & Aadhaar Verification',
    version: '2026.2 (Anti-Ghost Faculty Protocol)',
    description: 'Faculty members must not appear as full-time regular teachers in more than one AICTE-approved institution simultaneously.',
    prescribedThreshold: 'Zero duplicate Aadhaar/PAN roster overlap',
    isActive: true,
    severityIfViolated: 'High',
    lastUpdated: '2026-02-10'
  }
];

export const ANOMALIES_LIST: AnomalyItem[] = [
  {
    id: 'ANOM-2026-001',
    applicationId: 'APP-2026-AICTE-1340',
    institutionName: 'Deccan Polytechnic & Technical Campus',
    title: 'Duplicate Faculty Aadhaar Cross-Match',
    description: 'Prof. M. Suresh (Aadhaar ending in 8492) identified simultaneously on full-time teaching roster of Deccan Polytechnic and Sri Venkateswara College of Engg, Tirupati.',
    severity: 'High',
    evidence: 'Aadhaar hashed token match across AP and KA state council scrutiny repositories.',
    clause: 'APH-2026-5.8',
    detectedAt: '2026-02-23 11:42 IST',
    resolutionStatus: 'Unresolved'
  },
  {
    id: 'ANOM-2026-002',
    applicationId: 'APP-2026-AICTE-0842',
    institutionName: 'Apex Institute of Technology & Advanced Studies',
    title: 'Expired Fire Safety NOC with Unendorsed Renewal Receipt',
    description: 'Chief Fire Officer NOC expired on 15-Jan-2026. Institution submitted a local challan receipt without formal fire department inspection certificate.',
    severity: 'High',
    evidence: 'Fire_Safety_NOC_Chief_Fire_Officer.pdf (Page 2, stamp date mismatch).',
    clause: 'APH-2026-6.1',
    detectedAt: '2026-02-16 15:10 IST',
    resolutionStatus: 'Investigating'
  },
  {
    id: 'ANOM-2026-003',
    applicationId: 'APP-2026-AICTE-0842',
    institutionName: 'Apex Institute of Technology & Advanced Studies',
    title: 'Faculty Cadre Imbalance (CSE Dept)',
    description: 'Applied for 420 intake requires minimum 3 Professors and 6 Associate Professors. Institution roster has only 1 Professor and 2 Associate Professors.',
    severity: 'Medium',
    evidence: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf (Page 19, Roster deficiency calculation).',
    clause: 'APH-2026-5.2',
    detectedAt: '2026-02-16 15:14 IST',
    resolutionStatus: 'Unresolved'
  },
  {
    id: 'ANOM-2026-004',
    applicationId: 'APP-2026-AICTE-0711',
    institutionName: 'Indira Memorial College of Pharmacy',
    title: 'Lapsed CPCSEA Animal House Clearance',
    description: 'Pharmacology curriculum requires active CPCSEA approval. Submitted approval lapsed on 31-Dec-2025 without renewed registration certificate.',
    severity: 'High',
    evidence: 'PCI_Approval_and_CPCSEA_Letter.pdf (Page 4, CPCSEA expiry indicator).',
    clause: 'APH-2026-6.9',
    detectedAt: '2026-02-08 09:30 IST',
    resolutionStatus: 'Accepted with Justification',
    actionTaken: 'Application returned to applicant on 20-Feb-2026 with 14-day cure period.'
  },
  {
    id: 'ANOM-2026-005',
    applicationId: 'APP-2026-AICTE-1422',
    institutionName: 'Kolkata Metropolitan Institute of Science & Research',
    title: 'Land Conversion Order QR Code Unverified',
    description: 'State Revenue Department QR code on Land Conversion Order 492/LR/2025 could not be validated against the BanglarBhumi state land records endpoint.',
    severity: 'Medium',
    evidence: 'Land_Conversion_Order_Govt_WB.pdf (Page 3, QR cryptographic handshake pending).',
    clause: 'APH-2026-4.2',
    detectedAt: '2026-02-26 14:05 IST',
    resolutionStatus: 'Investigating'
  }
];

export const AUDIT_TRAIL: AuditLogEntry[] = [
  {
    id: 'AUDIT-8921',
    timestamp: '2026-03-03 10:15:22 IST',
    officerName: 'Dr. Ramanathan S.',
    officerRole: 'Senior Scrutiny Officer (RO Mumbai)',
    applicationId: 'APP-2026-AICTE-1340',
    action: 'Application Escalated to Standing Committee',
    details: 'Escalation triggered due to verified duplicate Aadhaar ghost-faculty detection under APH Clause 5.8.',
    ipAddress: '10.24.112.45 (NIC-AICTE VPN)',
    hashSignature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'AUDIT-8920',
    timestamp: '2026-03-02 16:48:10 IST',
    officerName: 'Dr. Ramanathan S.',
    officerRole: 'Senior Scrutiny Officer (RO Mumbai)',
    applicationId: 'APP-2026-AICTE-0842',
    action: 'Compliance Deficiency Flagged',
    details: 'Flagged Fire Safety NOC expiry and Cadre ratio deficit in Computer Science department.',
    ipAddress: '10.24.112.45 (NIC-AICTE VPN)',
    hashSignature: 'sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
  },
  {
    id: 'AUDIT-8919',
    timestamp: '2026-03-01 14:20:05 IST',
    officerName: 'Er. Sunita Deshmukh',
    officerRole: 'Scrutiny Officer (RO Chennai)',
    applicationId: 'APP-2026-AICTE-1109',
    action: 'Document Integrity Verified',
    details: 'GPU Lab infrastructure and Anna University NOC verified compliant with Chapter III emerging tech mandates.',
    ipAddress: '10.24.108.92 (NIC-AICTE VPN)',
    hashSignature: 'sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
  },
  {
    id: 'AUDIT-8918',
    timestamp: '2026-02-28 17:30:44 IST',
    officerName: 'Prof. K. Venkatesh',
    officerRole: 'Principal Scrutiny Officer',
    applicationId: 'APP-2026-AICTE-0941',
    action: 'EOA 2026-27 Approved',
    details: 'Approved Extension of Approval for Gurugram School of Management & Technology with 180 intake. E-Gazette sign-off registered.',
    ipAddress: '10.24.100.18 (NIC-AICTE HQ New Delhi)',
    hashSignature: 'sha256:6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090'
  },
  {
    id: 'AUDIT-8917',
    timestamp: '2026-02-20 11:12:30 IST',
    officerName: 'Prof. K. Venkatesh',
    officerRole: 'Principal Scrutiny Officer',
    applicationId: 'APP-2026-AICTE-0711',
    action: 'Application Returned for Correction',
    details: 'Formal deficiency memorandum issued to institution regarding lapsed CPCSEA animal house registration.',
    ipAddress: '10.24.100.18 (NIC-AICTE HQ New Delhi)',
    hashSignature: 'sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35'
  }
];
