'use strict';
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

let useFallback = false;

const memoryDB = {
  applications: [
    {
      id: 'APP-2026-AICTE-0842',
      institution_id: '1-4392817291',
      institution_name: 'Apex Institute of Technology & Advanced Studies',
      region: 'Western',
      state: 'Maharashtra',
      application_type: 'Increase in Approved Intake',
      program: 'Engineering & Technology',
      applied_intake: 420,
      current_intake: 300,
      submission_date: '2026-02-14',
      last_updated: '2026-03-02',
      status: 'Action Required',
      assigned_reviewer: 'Dr. Ramanathan S.',
      reviewer_role: 'Senior Scrutiny Officer (RO Mumbai)',
      discrepancy_count: 2,
      reviewer_notes: 'Faculty cadre ratio in Dept of Computer Science fails AICTE APH Clause 5.2. Land title deed verified compliant with 7.5 contiguous acres.'
    },
    {
      id: 'APP-2026-AICTE-1109',
      institution_id: '1-9382103982',
      institution_name: 'Coimbatore Institute of Engineering & Robotics',
      region: 'Southern',
      state: 'Tamil Nadu',
      application_type: 'Introduction of Emerging Tech',
      program: 'Engineering & Technology',
      applied_intake: 60,
      current_intake: 240,
      submission_date: '2026-02-18',
      last_updated: '2026-03-01',
      status: 'Pending Scrutiny',
      assigned_reviewer: 'Er. Sunita Deshmukh',
      reviewer_role: 'Scrutiny Officer (RO Chennai)',
      discrepancy_count: 0,
      reviewer_notes: 'New course application for B.Tech Artificial Intelligence & Machine Learning (60 seats). Laboratory equipment invoices submitted.'
    },
    {
      id: 'APP-2026-AICTE-0941',
      institution_id: '1-8492019482',
      institution_name: 'Gurugram School of Management & Technology',
      region: 'North-West',
      state: 'Haryana',
      application_type: 'Extension of Approval (EOA)',
      program: 'Management',
      applied_intake: 180,
      current_intake: 180,
      submission_date: '2026-02-10',
      last_updated: '2026-02-28',
      status: 'Approved',
      assigned_reviewer: 'Prof. K. Venkatesh',
      reviewer_role: 'Principal Scrutiny Officer',
      discrepancy_count: 0,
      reviewer_notes: 'EOA 2026-27 validated. All 18 compliance parameters conform to APH Chapter II norms without deficiencies.'
    },
    {
      id: 'APP-2026-AICTE-1340',
      institution_id: '1-7482910394',
      institution_name: 'Deccan Polytechnic & Technical Campus',
      region: 'South-Western',
      state: 'Karnataka',
      application_type: 'Extension of Approval (EOA)',
      program: 'Engineering & Technology',
      applied_intake: 240,
      current_intake: 240,
      submission_date: '2026-02-22',
      last_updated: '2026-03-03',
      status: 'Escalated',
      assigned_reviewer: 'Dr. Ramanathan S.',
      reviewer_role: 'Senior Scrutiny Officer (RO Mumbai)',
      discrepancy_count: 3,
      reviewer_notes: 'Escalated to Standing Complaint Committee: Potential ghost faculty detected. 2 faculty members registered simultaneously at an Andhra Pradesh institution.'
    },
    {
      id: 'APP-2026-AICTE-1422',
      institution_id: '1-6382019482',
      institution_name: 'Kolkata Metropolitan Institute of Science & Research',
      region: 'Eastern',
      state: 'West Bengal',
      application_type: 'New Technical Institution',
      program: 'Engineering & Technology',
      applied_intake: 360,
      current_intake: 0,
      submission_date: '2026-02-25',
      last_updated: '2026-03-02',
      status: 'Under Review',
      assigned_reviewer: 'Er. Sunita Deshmukh',
      reviewer_role: 'Scrutiny Officer (RO Chennai)',
      discrepancy_count: 1,
      reviewer_notes: 'New institution scrutiny under Chapter I of APH. Land conversion certificate pending verification with District Collectorate portal.'
    },
    {
      id: 'APP-2026-AICTE-0711',
      institution_id: '1-5291039481',
      institution_name: 'Indira Memorial College of Pharmacy',
      region: 'Central',
      state: 'Madhya Pradesh',
      application_type: 'Extension of Approval (EOA)',
      program: 'Pharmacy',
      applied_intake: 100,
      current_intake: 100,
      submission_date: '2026-02-05',
      last_updated: '2026-02-20',
      status: 'Returned for Correction',
      assigned_reviewer: 'Prof. K. Venkatesh',
      reviewer_role: 'Principal Scrutiny Officer',
      discrepancy_count: 2,
      reviewer_notes: 'Returned to applicant for missing Animal House approval certificate (CPCSEA) and Pharmacognosy lab gas line safety certificate.'
    }
  ],
  documents: [
    { id: 'DOC-01', application_id: 'APP-2026-AICTE-0842', name: 'Land_Title_Sale_Deed_Khasra_84.pdf', type: 'PDF', category: 'Land & Legal', file_size: '14.2 MB', upload_date: '2026-02-14', status: 'Verified', ocr_status: 'Processed (100% confidence)', pages: 34, deficiency_note: null, sha256_hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' },
    { id: 'DOC-02', application_id: 'APP-2026-AICTE-0842', name: 'Fire_Safety_NOC_Chief_Fire_Officer.pdf', type: 'PDF', category: 'Building & Safety', file_size: '4.8 MB', upload_date: '2026-02-14', status: 'Flagged', ocr_status: 'Needs Clarification', pages: 8, deficiency_note: 'Certificate expired on 15-Jan-2026. Renewal receipt dated 02-Feb-2026 attached without Chief Fire Officer endorsement.', sha256_hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3' },
    { id: 'DOC-03', application_id: 'APP-2026-AICTE-0842', name: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf', type: 'PDF', category: 'Faculty & Cadre', file_size: '8.1 MB', upload_date: '2026-02-15', status: 'Flagged', ocr_status: 'Processed (100% confidence)', pages: 42, deficiency_note: 'Cadre ratio deficit: Applied for 420 intake requires 3 Professors in CSE. Only 1 Professor on regular appointment roster.', sha256_hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4' },
    { id: 'DOC-04', application_id: 'APP-2026-AICTE-0842', name: 'Joint_FDR_Security_AICTE_RO.pdf', type: 'PDF', category: 'Finance & FDR', file_size: '2.4 MB', upload_date: '2026-02-14', status: 'Verified', ocr_status: 'Processed (100% confidence)', pages: 4, deficiency_note: null, sha256_hash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5' },
    { id: 'DOC-11', application_id: 'APP-2026-AICTE-1109', name: 'Lab_Infrastructure_AI_GPU_Invoices.pdf', type: 'PDF', category: 'Building & Safety', file_size: '6.7 MB', upload_date: '2026-02-18', status: 'Verified', ocr_status: 'Processed (100% confidence)', pages: 16, deficiency_note: null, sha256_hash: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6' },
    { id: 'DOC-12', application_id: 'APP-2026-AICTE-1109', name: 'University_Affiliation_Approval_AnnaUniv.pdf', type: 'PDF', category: 'Affiliation', file_size: '3.1 MB', upload_date: '2026-02-18', status: 'Verified', ocr_status: 'Processed (100% confidence)', pages: 6, deficiency_note: null, sha256_hash: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1' },
    { id: 'DOC-21', application_id: 'APP-2026-AICTE-0941', name: 'EOA_Annual_Self_Disclosure_2026.pdf', type: 'PDF', category: 'Land & Legal', file_size: '12.0 MB', upload_date: '2026-02-10', status: 'Verified', ocr_status: 'Processed (100% confidence)', pages: 58, deficiency_note: null, sha256_hash: 'a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3' },
    { id: 'DOC-31', application_id: 'APP-2026-AICTE-1340', name: 'Faculty_Declaration_Forms_Affidavit.pdf', type: 'PDF', category: 'Faculty & Cadre', file_size: '15.4 MB', upload_date: '2026-02-22', status: 'Flagged', ocr_status: 'Needs Clarification', pages: 64, deficiency_note: 'Aadhaar ID cross-match flagged duplicate employment for Prof. M. Suresh and Asst. Prof. Priya Nair.', sha256_hash: 'b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4' },
    { id: 'DOC-41', application_id: 'APP-2026-AICTE-1422', name: 'Land_Conversion_Order_Govt_WB.pdf', type: 'PDF', category: 'Land & Legal', file_size: '5.2 MB', upload_date: '2026-02-25', status: 'Under Inspection', ocr_status: 'Needs Clarification', pages: 12, deficiency_note: 'Digital QR on state revenue order requires live API ping confirmation from BanglarBhumi database.', sha256_hash: 'c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5' },
    { id: 'DOC-51', application_id: 'APP-2026-AICTE-0711', name: 'PCI_Approval_and_CPCSEA_Letter.pdf', type: 'PDF', category: 'Building & Safety', file_size: '3.9 MB', upload_date: '2026-02-05', status: 'Flagged', ocr_status: 'Needs Clarification', pages: 9, deficiency_note: 'CPCSEA clearance letter expired in Dec 2025. Animal house inspection report missing.', sha256_hash: 'd5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6' }
  ],
  extracted_fields: [
    { document_id: 'DOC-01', field_name: 'Contiguous Land Area', extracted_value: '7.50 Acres', prescribed_norm: 'Min 5.0 Acres (Non-Metro)', status: 'Compliant', confidence: 0.99, clause_ref: 'APH Sec 4.1', page_number: 4 },
    { document_id: 'DOC-01', field_name: 'Land Ownership Type', extracted_value: 'Clear Title (Freehold)', prescribed_norm: 'Freehold or 30-year Govt Lease', status: 'Compliant', confidence: 0.98, clause_ref: 'APH Sec 4.2', page_number: 6 },
    { document_id: 'DOC-01', field_name: 'Non-Encumbrance Certificate', extracted_value: 'Valid up to 2050 (Sub-Registrar)', prescribed_norm: 'Current & Unencumbered', status: 'Compliant', confidence: 0.96, clause_ref: 'APH Sec 4.4', page_number: 12 },
    { document_id: 'DOC-02', field_name: 'NOC Validity Date', extracted_value: '15-Jan-2026 (Expired)', prescribed_norm: 'Valid on scrutiny date', status: 'Discrepancy', confidence: 0.94, clause_ref: 'APH Sec 6.1', page_number: 2 },
    { document_id: 'DOC-02', field_name: 'Fire Sprinkler Coverage', extracted_value: 'Installed (Labs & Seminar)', prescribed_norm: 'All Academic Blocks', status: 'Compliant', confidence: 0.92, clause_ref: 'NBC 2016 Part 4', page_number: 5 },
    { document_id: 'DOC-03', field_name: 'Faculty Student Ratio (FSR)', extracted_value: '1 : 16.2', prescribed_norm: '1 : 15 (Engineering UG)', status: 'Discrepancy', confidence: 0.97, clause_ref: 'APH Sec 5.1', page_number: 18 },
    { document_id: 'DOC-03', field_name: 'Cadre Ratio (Prof:Assoc:Asst)', extracted_value: '1 : 2 : 14 (CSE)', prescribed_norm: '1 : 2 : 6', status: 'Discrepancy', confidence: 0.95, clause_ref: 'APH Sec 5.2', page_number: 19 },
    { document_id: 'DOC-03', field_name: 'Biometric Attendance Integration', extracted_value: 'Live linked to University', prescribed_norm: 'Mandatory', status: 'Compliant', confidence: 0.99, clause_ref: 'APH Sec 5.7', page_number: 31 },
    { document_id: 'DOC-04', field_name: 'Joint FDR Value', extracted_value: '₹1,50,00,000/-', prescribed_norm: '₹1.50 Crore', status: 'Compliant', confidence: 0.99, clause_ref: 'APH Sec 8.1', page_number: 1 },
    { document_id: 'DOC-04', field_name: 'Lien in favour of Regional Officer', extracted_value: 'Confirmed (SBI Mumbai Main)', prescribed_norm: 'RO AICTE Joint Account', status: 'Compliant', confidence: 0.98, clause_ref: 'APH Sec 8.2', page_number: 2 },
    { document_id: 'DOC-11', field_name: 'High-Performance Workstations', extracted_value: '40 Units (NVIDIA RTX)', prescribed_norm: 'Min 30 Units for 60 batch', status: 'Compliant', confidence: 0.99, clause_ref: 'APH Sec 6.4', page_number: 3 },
    { document_id: 'DOC-11', field_name: 'Licensed Software / Open Source Frameworks', extracted_value: 'CUDA, PyTorch, ROS2', prescribed_norm: 'Mandatory AI Labs', status: 'Compliant', confidence: 0.97, clause_ref: 'APH Sec 6.5', page_number: 7 },
    { document_id: 'DOC-12', field_name: 'Affiliating University Consent', extracted_value: 'Approved for 2026-27', prescribed_norm: 'Mandatory NOC', status: 'Compliant', confidence: 0.98, clause_ref: 'APH Sec 3.2', page_number: 1 },
    { document_id: 'DOC-21', field_name: 'Total Built-up Area', extracted_value: '18,450 sq.m.', prescribed_norm: 'Min 12,000 sq.m.', status: 'Compliant', confidence: 0.99, clause_ref: 'APH Sec 4.3', page_number: 11 },
    { document_id: 'DOC-21', field_name: 'Library Digital Subscriptions', extracted_value: 'EBSCO, ProQuest, Harvard Cases', prescribed_norm: 'Min 2 Digital Packages', status: 'Compliant', confidence: 0.99, clause_ref: 'APH Sec 6.8', page_number: 24 },
    { document_id: 'DOC-31', field_name: 'Cross-Institutional Faculty Match', extracted_value: 'Duplicate Found (SVEC Tirupati)', prescribed_norm: 'Single Exclusive Employment', status: 'Discrepancy', confidence: 0.99, clause_ref: 'APH Sec 5.8', page_number: 12 },
    { document_id: 'DOC-41', field_name: 'Land Use Conversion', extracted_value: 'Institutional Use Permitted', prescribed_norm: 'Educational / Institutional Classification', status: 'Unverified', confidence: 0.88, clause_ref: 'APH Sec 4.2', page_number: 3 },
    { document_id: 'DOC-51', field_name: 'CPCSEA Registration', extracted_value: 'Expired 31-Dec-2025', prescribed_norm: 'Valid CPCSEA certification for B.Pharm', status: 'Discrepancy', confidence: 0.96, clause_ref: 'PCI / APH Norms', page_number: 4 }
  ],
  compliance_checks: [
    { id: 'CHK-1', application_id: 'APP-2026-AICTE-0842', clause: 'APH 4.1', category: 'Land Norms', requirement: 'Contiguous land area min 5 acres (Urban/Town)', institution_submitted: '7.50 contiguous acres', result: 'Compliant', evidence_source: 'Land_Title_Sale_Deed_Khasra_84.pdf, Page 4', notes: null },
    { id: 'CHK-2', application_id: 'APP-2026-AICTE-0842', clause: 'APH 5.1', category: 'Cadre Ratio', requirement: 'Faculty-student ratio 1:15 in Engineering UG', institution_submitted: '1:16.2 overall, 1:17.1 in CSE', result: 'Deficit', evidence_source: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf, Page 18', notes: 'Shortage of 4 full-time faculties' },
    { id: 'CHK-3', application_id: 'APP-2026-AICTE-0842', clause: 'APH 5.2', category: 'Faculty Cadre', requirement: 'Cadre ratio 1:2:6 per program division', institution_submitted: '1 Professor, 2 Associate, 14 Assistant in CSE', result: 'Deficit', evidence_source: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf, Page 19', notes: 'Deficit of 2 Professors' },
    { id: 'CHK-4', application_id: 'APP-2026-AICTE-0842', clause: 'APH 6.1', category: 'Safety & Hygiene', requirement: 'Valid Fire NOC issued by Competent Govt Authority', institution_submitted: 'Expired Jan 2026, provisional renewal receipt', result: 'Reviewer Discretion', evidence_source: 'Fire_Safety_NOC_Chief_Fire_Officer.pdf, Page 2', notes: null },
    { id: 'CHK-5', application_id: 'APP-2026-AICTE-0842', clause: 'APH 7.3', category: 'Barrier-Free Access', requirement: 'Lifts, accessible washrooms, ramps for PWD as per NBC 2016', institution_submitted: 'Architectural certificate with 2 lifts + ramps in block A, B', result: 'Compliant', evidence_source: 'Architect_Barrier_Free_Certificate.pdf, Page 3', notes: null },
    { id: 'CHK-6', application_id: 'APP-2026-AICTE-0842', clause: 'APH 8.1', category: 'Financial Viability', requirement: 'Joint Fixed Deposit with AICTE RO lien', institution_submitted: '₹1.50 Crore SBI Bank FDR with AICTE RO Western lien', result: 'Compliant', evidence_source: 'Joint_FDR_Security_AICTE_RO.pdf, Page 1', notes: null },
    { id: 'CHK-11', application_id: 'APP-2026-AICTE-1109', clause: 'APH 3.2', category: 'Affiliation', requirement: 'Affiliating University NOC for emerging branch', institution_submitted: 'Anna University Syndicate Resolution NOC dated Jan 2026', result: 'Compliant', evidence_source: 'University_Affiliation_Approval_AnnaUniv.pdf, Page 1', notes: null },
    { id: 'CHK-12', application_id: 'APP-2026-AICTE-1109', clause: 'APH 6.4', category: 'Lab Norms', requirement: 'Dedicated computing lab for AI/ML with GPU clusters', institution_submitted: '40 high-performance GPU workstations with 1 Gbps lease line', result: 'Compliant', evidence_source: 'Lab_Infrastructure_AI_GPU_Invoices.pdf, Page 3', notes: null },
    { id: 'CHK-21', application_id: 'APP-2026-AICTE-0941', clause: 'APH 4.3', category: 'Built-up Area', requirement: 'Built up instructional area >= 12,000 sq.m.', institution_submitted: '18,450 sq.m. verified through municipal occupancy certificate', result: 'Compliant', evidence_source: 'EOA_Annual_Self_Disclosure_2026.pdf, Page 11', notes: null },
    { id: 'CHK-22', application_id: 'APP-2026-AICTE-0941', clause: 'APH 5.1', category: 'FSR Management', requirement: 'FSR 1:20 for PGDM / MBA programs', institution_submitted: '1:14.5 with 14 full-time PhD doctorates', result: 'Compliant', evidence_source: 'EOA_Annual_Self_Disclosure_2026.pdf, Page 19', notes: null },
    { id: 'CHK-31', application_id: 'APP-2026-AICTE-1340', clause: 'APH 5.8', category: 'Faculty Integrity', requirement: 'Exclusive full-time regular employment with single AICTE institute', institution_submitted: 'Aadhaar duplicate recorded across 2 institutions', result: 'Deficit', evidence_source: 'Faculty_Declaration_Forms_Affidavit.pdf, Page 12', notes: 'Severe violation: Hearing notice initiated' },
    { id: 'CHK-41', application_id: 'APP-2026-AICTE-1422', clause: 'APH 4.2', category: 'Land Norms', requirement: 'Statutory government land use conversion order', institution_submitted: 'Order No. 492/LR/2025 submitted, QR pending API handshake', result: 'Pending Verification', evidence_source: 'Land_Conversion_Order_Govt_WB.pdf, Page 3', notes: null },
    { id: 'CHK-51', application_id: 'APP-2026-AICTE-0711', clause: 'APH 6.9', category: 'Pharmacy Lab Norms', requirement: 'CPCSEA approval for animal house and bio-waste disposal', institution_submitted: 'Expired certificate submitted', result: 'Deficit', evidence_source: 'PCI_Approval_and_CPCSEA_Letter.pdf, Page 4', notes: null }
  ],
  compliance_rules: [
    { id: 'RULE-01', code: 'APH-2026-4.1', name: 'Minimum Contiguous Land Norm', category: 'Land & Legal', aph_chapter: 'Chapter IV: Infrastructure Norms', version: '2026.1 (APH Gazetted)', description: 'Institution must possess required contiguous land area in title or registered lease (>=30 yrs) free from legal encumbrance, without intervening public roads.', prescribed_threshold: '>= 5.0 Acres (Non-Metro) / >= 2.5 Acres (Metro)', is_active: 1, severity_if_violated: 'High', last_updated: '2026-01-15' },
    { id: 'RULE-02', code: 'APH-2026-5.1', name: 'Faculty-to-Student Ratio (FSR)', category: 'Faculty & Cadre', aph_chapter: 'Chapter V: Norms for Faculty Requirements', version: '2026.1 (APH Gazetted)', description: 'Institutions offering undergraduate engineering degrees must maintain prescribed full-time faculty to student headcount ratio.', prescribed_threshold: '1 : 15 (Undergraduate Engineering & Tech)', is_active: 1, severity_if_violated: 'High', last_updated: '2026-01-15' },
    { id: 'RULE-03', code: 'APH-2026-5.2', name: 'Cadre Structure Compliance', category: 'Faculty & Cadre', aph_chapter: 'Chapter V: Faculty Cadre Proportions', version: '2026.1 (APH Gazetted)', description: 'For each department/division, faculty must be balanced in the ratio of Professor : Associate Professor : Assistant Professor with UGC/AICTE minimum qualifications.', prescribed_threshold: '1 : 2 : 6 (Cadre Distribution)', is_active: 1, severity_if_violated: 'Medium', last_updated: '2026-01-15' },
    { id: 'RULE-04', code: 'APH-2026-6.1', name: 'Statutory Fire & Life Safety Certificate', category: 'Building & Safety', aph_chapter: 'Chapter VI: Building & Life Safety Mandates', version: '2026.2 (Updated Safety Directive)', description: 'Valid Fire Safety NOC issued by State Chief Fire Officer or Municipal Authority covering academic, administrative, and hostel buildings.', prescribed_threshold: 'Valid & active on the date of approval scrutiny', is_active: 1, severity_if_violated: 'High', last_updated: '2026-02-01' },
    { id: 'RULE-05', code: 'APH-2026-7.3', name: 'Barrier-Free Physical Environment (PWD)', category: 'Building & Safety', aph_chapter: 'Chapter VII: Essential Amenities', version: '2026.1 (APH Gazetted)', description: 'As per RPwD Act 2016, campus must provide dedicated wheelchair ramps, accessible elevators with braille indicators, and uni-sex disabled washrooms.', prescribed_threshold: '100% Academic & Administrative Block Compliance', is_active: 1, severity_if_violated: 'Medium', last_updated: '2026-01-15' },
    { id: 'RULE-06', code: 'APH-2026-8.1', name: 'Joint Fixed Deposit Security (Security Deposit)', category: 'Finance & FDR', aph_chapter: 'Chapter VIII: Financial Viability Norms', version: '2026.1 (APH Gazetted)', description: 'Joint FDR in scheduled commercial bank with Regional Officer AICTE for statutory security deposit tenure (minimum 10 years).', prescribed_threshold: '₹1.50 Crore (Engg UG) / ₹1.00 Crore (PGDM)', is_active: 1, severity_if_violated: 'High', last_updated: '2026-01-15' },
    { id: 'RULE-07', code: 'APH-2026-5.8', name: 'Single Full-Time Employment Verification', category: 'Faculty & Cadre', aph_chapter: 'Chapter V: Integrity & Aadhaar Verification', version: '2026.2 (Anti-Ghost Faculty Protocol)', description: 'Faculty members must not appear as full-time regular teachers in more than one AICTE-approved institution simultaneously.', prescribed_threshold: 'Zero duplicate Aadhaar/PAN roster overlap', is_active: 1, severity_if_violated: 'High', last_updated: '2026-02-10' }
  ],
  anomalies: [
    { id: 'ANOM-2026-001', application_id: 'APP-2026-AICTE-1340', institution_name: 'Deccan Polytechnic & Technical Campus', title: 'Duplicate Faculty Aadhaar Cross-Match', description: 'Prof. M. Suresh (Aadhaar ending in 8492) identified simultaneously on full-time teaching roster of Deccan Polytechnic and Sri Venkateswara College of Engg, Tirupati.', severity: 'High', evidence: 'Aadhaar hashed token match across AP and KA state council scrutiny repositories.', clause: 'APH-2026-5.8', detected_at: '2026-02-23 11:42 IST', resolution_status: 'Unresolved', action_taken: null },
    { id: 'ANOM-2026-002', application_id: 'APP-2026-AICTE-0842', institution_name: 'Apex Institute of Technology & Advanced Studies', title: 'Expired Fire Safety NOC with Unendorsed Renewal Receipt', description: 'Chief Fire Officer NOC expired on 15-Jan-2026. Institution submitted a local challan receipt without formal fire department inspection certificate.', severity: 'High', evidence: 'Fire_Safety_NOC_Chief_Fire_Officer.pdf (Page 2, stamp date mismatch).', clause: 'APH-2026-6.1', detected_at: '2026-02-16 15:10 IST', resolution_status: 'Investigating', action_taken: null },
    { id: 'ANOM-2026-003', application_id: 'APP-2026-AICTE-0842', institution_name: 'Apex Institute of Technology & Advanced Studies', title: 'Faculty Cadre Imbalance (CSE Dept)', description: 'Applied for 420 intake requires minimum 3 Professors and 6 Associate Professors. Institution roster has only 1 Professor and 2 Associate Professors.', severity: 'Medium', evidence: 'Faculty_Cadre_Roster_Aadhaar_Verified.pdf (Page 19, Roster deficiency calculation).', clause: 'APH-2026-5.2', detected_at: '2026-02-16 15:14 IST', resolution_status: 'Unresolved', action_taken: null },
    { id: 'ANOM-2026-004', application_id: 'APP-2026-AICTE-0711', institution_name: 'Indira Memorial College of Pharmacy', title: 'Lapsed CPCSEA Animal House Clearance', description: 'Pharmacology curriculum requires active CPCSEA approval. Submitted approval lapsed on 31-Dec-2025 without renewed registration certificate.', severity: 'High', evidence: 'PCI_Approval_and_CPCSEA_Letter.pdf (Page 4, CPCSEA expiry indicator).', clause: 'APH-2026-6.9', detected_at: '2026-02-08 09:30 IST', resolution_status: 'Accepted with Justification', action_taken: 'Application returned to applicant on 20-Feb-2026 with 14-day cure period.' },
    { id: 'ANOM-2026-005', application_id: 'APP-2026-AICTE-1422', institution_name: 'Kolkata Metropolitan Institute of Science & Research', title: 'Land Conversion Order QR Code Unverified', description: 'State Revenue Department QR code on Land Conversion Order 492/LR/2025 could not be validated against the BanglarBhumi state land records endpoint.', severity: 'Medium', evidence: 'Land_Conversion_Order_Govt_WB.pdf (Page 3, QR cryptographic handshake pending).', clause: 'APH-2026-4.2', detected_at: '2026-02-26 14:05 IST', resolution_status: 'Investigating', action_taken: null }
  ],
  audit_logs: [
    { id: 'AUDIT-8921', timestamp: '2026-03-03 10:15:22 IST', officer_name: 'Dr. Ramanathan S.', officer_role: 'Senior Scrutiny Officer (RO Mumbai)', application_id: 'APP-2026-AICTE-1340', action: 'Application Escalated to Standing Committee', details: 'Escalation triggered due to verified duplicate Aadhaar ghost-faculty detection under APH Clause 5.8.', ip_address: '10.24.112.45 (NIC-AICTE VPN)', hash_signature: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069' },
    { id: 'AUDIT-8920', timestamp: '2026-03-02 16:48:10 IST', officer_name: 'Dr. Ramanathan S.', officer_role: 'Senior Scrutiny Officer (RO Mumbai)', application_id: 'APP-2026-AICTE-0842', action: 'Compliance Deficiency Flagged', details: 'Flagged Fire Safety NOC expiry and Cadre ratio deficit in Computer Science department.', ip_address: '10.24.112.45 (NIC-AICTE VPN)', hash_signature: 'sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a' },
    { id: 'AUDIT-8919', timestamp: '2026-03-01 14:20:05 IST', officer_name: 'Er. Sunita Deshmukh', officer_role: 'Scrutiny Officer (RO Chennai)', application_id: 'APP-2026-AICTE-1109', action: 'Document Integrity Verified', details: 'GPU Lab infrastructure and Anna University NOC verified compliant with Chapter III emerging tech mandates.', ip_address: '10.24.108.92 (NIC-AICTE VPN)', hash_signature: 'sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d' },
    { id: 'AUDIT-8918', timestamp: '2026-02-28 17:30:44 IST', officer_name: 'Prof. K. Venkatesh', officer_role: 'Principal Scrutiny Officer', application_id: 'APP-2026-AICTE-0941', action: 'EOA 2026-27 Approved', details: 'Approved Extension of Approval for Gurugram School of Management & Technology with 180 intake. E-Gazette sign-off registered.', ip_address: '10.24.100.18 (NIC-AICTE HQ New Delhi)', hash_signature: 'sha256:6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090' },
    { id: 'AUDIT-8917', timestamp: '2026-02-20 11:12:30 IST', officer_name: 'Prof. K. Venkatesh', officer_role: 'Principal Scrutiny Officer', application_id: 'APP-2026-AICTE-0711', action: 'Application Returned for Correction', details: 'Formal deficiency memorandum issued to institution regarding lapsed CPCSEA animal house registration.', ip_address: '10.24.100.18 (NIC-AICTE HQ New Delhi)', hash_signature: 'sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' }
  ],
  document_hashes: [],
  issuer_verifications: []
};

memoryDB.documents.forEach(d => {
  if (d.sha256_hash) {
    memoryDB.document_hashes.push({
      sha256_hash: d.sha256_hash,
      document_id: d.id,
      application_id: d.application_id,
      file_name: d.name
    });
  }
});

let realPool = null;
try {
  realPool = mysql.createPool({
    host:             process.env.DB_HOST     || 'localhost',
    user:             process.env.DB_USER     || 'root',
    password:         process.env.DB_PASSWORD || '',
    database:         process.env.DB_NAME     || 'aicte_setu',
    waitForConnections: true,
    connectionLimit:  10,
    queueLimit:       0,
    multipleStatements: true,
    connectTimeout:   2000,
  });
} catch (_) {}

async function executeMemoryQuery(sql, params = []) {
  const norm = sql.trim().replace(/\s+/g, ' ');

  if (/^SELECT \* FROM applications WHERE id = \?/i.test(norm)) {
    const item = memoryDB.applications.find(a => a.id === params[0]);
    return [item ? [item] : []];
  }
  if (/^SELECT \* FROM applications/i.test(norm)) {
    return [[...memoryDB.applications]];
  }

  if (/^UPDATE applications SET status =/i.test(norm)) {
    const [status, notes, id] = params;
    const item = memoryDB.applications.find(a => a.id === id);
    if (item) {
      item.status = status;
      item.reviewer_notes = notes || '';
      item.last_updated = new Date().toISOString().slice(0, 10);
    }
    return [{ affectedRows: item ? 1 : 0 }];
  }

  if (/^INSERT INTO applications/i.test(norm)) {
    const [id, inst_id, inst_name, region, state, app_type, prog, applied, current, status, rev, role, notes] = params;
    const newApp = {
      id,
      institution_id: inst_id,
      institution_name: inst_name,
      region,
      state,
      application_type: app_type,
      program: prog,
      applied_intake: applied,
      current_intake: current,
      submission_date: new Date().toISOString().slice(0, 10),
      last_updated: new Date().toISOString().slice(0, 10),
      status: status || 'Pending Scrutiny',
      assigned_reviewer: rev,
      reviewer_role: role,
      discrepancy_count: 0,
      reviewer_notes: notes || ''
    };
    memoryDB.applications.unshift(newApp);
    return [{ insertId: id }];
  }

  if (/^SELECT \* FROM documents WHERE id = \?/i.test(norm)) {
    const doc = memoryDB.documents.find(d => d.id === params[0]);
    return [doc ? [doc] : []];
  }
  if (/^SELECT \* FROM documents WHERE application_id = \?/i.test(norm)) {
    return [memoryDB.documents.filter(d => d.application_id === params[0])];
  }
  if (/^SELECT \* FROM documents/i.test(norm)) {
    return [[...memoryDB.documents]];
  }
  if (/^UPDATE documents SET status =/i.test(norm)) {
    const [newStatus, id] = params;
    const doc = memoryDB.documents.find(d => d.id === id);
    if (doc) doc.status = newStatus;
    return [{ affectedRows: doc ? 1 : 0 }];
  }
  if (/^INSERT INTO documents/i.test(norm)) {
    const [id, application_id, name, type, category, file_size, file_path, ocr_status, sha256_hash] = params;
    const newDoc = {
      id,
      application_id,
      name,
      type,
      category,
      file_size,
      file_path,
      upload_date: new Date().toISOString().slice(0, 10),
      status: 'Under Inspection',
      ocr_status,
      pages: 1,
      sha256_hash
    };
    memoryDB.documents.unshift(newDoc);
    return [{ insertId: id }];
  }
  if (/SELECT.*FROM document_hashes.*WHERE.*sha256_hash = \? AND.*application_id != \?/i.test(norm)) {
    const [hash, appId] = params;
    return [memoryDB.document_hashes.filter(dh => dh.sha256_hash === hash && dh.application_id !== appId)];
  }
  if (/^INSERT INTO document_hashes/i.test(norm)) {
    const [hash, docId, appId, fname] = params;
    memoryDB.document_hashes.push({ sha256_hash: hash, document_id: docId, application_id: appId, file_name: fname });
    return [{ affectedRows: 1 }];
  }

  if (/^SELECT \* FROM extracted_fields WHERE document_id = \?/i.test(norm)) {
    return [memoryDB.extracted_fields.filter(f => f.document_id === params[0])];
  }
  if (/^SELECT \* FROM extracted_fields/i.test(norm)) {
    return [[...memoryDB.extracted_fields]];
  }
  if (/SELECT.*FROM extracted_fields.*JOIN documents/i.test(norm)) {
    const [valLike, appId] = params;
    const needle = (valLike || '').replace(/%/g, '').toLowerCase();
    const matches = memoryDB.extracted_fields.filter(f => {
      const match = (f.extracted_value || '').toLowerCase().includes(needle);
      if (!match) return false;
      const parentDoc = memoryDB.documents.find(d => d.id === f.document_id);
      return parentDoc && parentDoc.application_id !== appId;
    });
    return [matches.map(m => {
      const parent = memoryDB.documents.find(d => d.id === m.document_id);
      return { document_id: m.document_id, application_id: parent?.application_id, doc_name: parent?.name };
    })];
  }
  if (/^INSERT INTO extracted_fields/i.test(norm)) {
    const valuesList = params[0] || [];
    for (const row of valuesList) {
      const [document_id, field_name, extracted_value, prescribed_norm, status, confidence, clause_ref, page_number] = row;
      memoryDB.extracted_fields.push({
        document_id,
        field_name,
        extracted_value,
        prescribed_norm,
        status,
        confidence,
        clause_ref,
        page_number
      });
    }
    return [{ affectedRows: valuesList.length }];
  }

  if (/^SELECT \* FROM compliance_checks WHERE application_id = \?/i.test(norm)) {
    return [memoryDB.compliance_checks.filter(c => c.application_id === params[0])];
  }
  if (/^SELECT \* FROM compliance_checks/i.test(norm)) {
    return [[...memoryDB.compliance_checks]];
  }
  if (/^SELECT \* FROM compliance_rules WHERE id = \?/i.test(norm)) {
    const r = memoryDB.compliance_rules.find(rule => rule.id === params[0]);
    return [r ? [r] : []];
  }
  if (/^SELECT \* FROM compliance_rules/i.test(norm)) {
    return [[...memoryDB.compliance_rules]];
  }
  if (/^UPDATE compliance_rules SET is_active = NOT is_active WHERE id = \?/i.test(norm)) {
    const r = memoryDB.compliance_rules.find(rule => rule.id === params[0]);
    if (r) r.is_active = r.is_active ? 0 : 1;
    return [{ affectedRows: r ? 1 : 0 }];
  }

  if (/^SELECT \* FROM anomalies WHERE id = \?/i.test(norm)) {
    const a = memoryDB.anomalies.find(anom => anom.id === params[0]);
    return [a ? [a] : []];
  }
  if (/^SELECT \* FROM anomalies/i.test(norm)) {
    return [[...memoryDB.anomalies]];
  }
  if (/^UPDATE anomalies SET resolution_status = \?, action_taken = \? WHERE id = \?/i.test(norm)) {
    const [status, action, id] = params;
    const anom = memoryDB.anomalies.find(a => a.id === id);
    if (anom) {
      anom.resolution_status = status;
      anom.action_taken = action || null;
    }
    return [{ affectedRows: anom ? 1 : 0 }];
  }
  if (/^INSERT INTO anomalies/i.test(norm)) {
    const [id, application_id, institution_name, title, description, severity, evidence, clause, detected_at, resolution_status] = params;
    memoryDB.anomalies.unshift({
      id,
      application_id,
      institution_name,
      title,
      description,
      severity,
      evidence,
      clause,
      detected_at,
      resolution_status
    });
    return [{ insertId: id }];
  }

  if (/^SELECT \* FROM audit_logs/i.test(norm)) {
    return [[...memoryDB.audit_logs]];
  }
  if (/^INSERT INTO audit_logs/i.test(norm)) {
    const [id, timestamp, officer_name, officer_role, application_id, action, details, ip_address, hash_signature] = params;
    memoryDB.audit_logs.unshift({
      id,
      timestamp,
      officer_name,
      officer_role,
      application_id,
      action,
      details,
      ip_address,
      hash_signature
    });
    return [{ insertId: id }];
  }

  if (/^SELECT \* FROM issuer_verifications/i.test(norm)) {
    return [memoryDB.issuer_verifications.filter(v => v.document_id === params[0])];
  }
  if (/^INSERT INTO issuer_verifications/i.test(norm)) {
    const [document_id, issuer_type, verification_method, status, source_name, source_response, verified_at] = params;
    memoryDB.issuer_verifications.unshift({
      document_id,
      issuer_type,
      verification_method,
      status,
      source_name,
      source_response,
      verified_at,
      created_at: new Date()
    });
    return [{ affectedRows: 1 }];
  }

  if (/SELECT.*COUNT\(\*\).*FROM applications/i.test(norm)) {
    const totalApplications = memoryDB.applications.length;
    const pendingScrutiny = memoryDB.applications.filter(a => ['Pending Scrutiny', 'Under Review'].includes(a.status)).length;
    const actionRequired = memoryDB.applications.filter(a => ['Action Required', 'Escalated'].includes(a.status)).length;
    const completed = memoryDB.applications.filter(a => ['Approved', 'Returned for Correction'].includes(a.status)).length;
    return [[{ totalApplications, pendingScrutiny, actionRequired, completed }]];
  }
  if (/SELECT.*COUNT\(\*\).*FROM documents/i.test(norm)) {
    const totalDocuments = memoryDB.documents.length;
    const flaggedDocuments = memoryDB.documents.filter(d => d.status === 'Flagged').length;
    const verifiedDocuments = memoryDB.documents.filter(d => d.status === 'Verified').length;
    const pendingDocuments = memoryDB.documents.filter(d => d.status === 'Under Inspection').length;
    return [[{ totalDocuments, flaggedDocuments, verifiedDocuments, pendingDocuments }]];
  }
  if (/SELECT.*COUNT\(\*\).*FROM anomalies/i.test(norm)) {
    const totalAnomalies = memoryDB.anomalies.length;
    const unresolvedAnomalies = memoryDB.anomalies.filter(a => a.resolution_status === 'Unresolved').length;
    const highSeverity = memoryDB.anomalies.filter(a => a.severity === 'High').length;
    return [[{ totalAnomalies, unresolvedAnomalies, highSeverity }]];
  }

  return [[]];
}

const pool = {
  async query(sql, params) {
    if (useFallback || !realPool) {
      return executeMemoryQuery(sql, params);
    }
    try {
      return await realPool.query(sql, params);
    } catch (err) {
      if (!useFallback) {
        console.warn(`[DB] MySQL query failed (${err.code || err.message}). Switching to In-Memory DB.`);
        useFallback = true;
      }
      return executeMemoryQuery(sql, params);
    }
  },
  async getConnection() {
    if (useFallback || !realPool) {
      return {
        async query(s, p) { return pool.query(s, p); },
        release() {}
      };
    }
    return realPool.getConnection();
  }
};

async function initDB() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  let conn;
  try {
    if (!realPool) throw new Error('No MySQL pool configured');
    conn = await realPool.getConnection();
    await conn.query(sql);
    console.log('[DB] Connected to MySQL: schema initialised and seed data loaded.');
  } catch (err) {
    useFallback = true;
    console.log('[DB] MySQL server not reachable on localhost.');
    console.log('[DB] Activated In-Memory DB fallback with full AICTE seed dataset.');
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, initDB, memoryDB };
