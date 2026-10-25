CREATE DATABASE IF NOT EXISTS aicte_setu;
USE aicte_setu;


CREATE TABLE IF NOT EXISTS applications (
  id                VARCHAR(50)  PRIMARY KEY,
  institution_id    VARCHAR(50)  NOT NULL,
  institution_name  VARCHAR(255) NOT NULL,
  region            ENUM('Northern','Southern','Western','Eastern','Central','South-Western','North-West') NOT NULL,
  state             VARCHAR(100) NOT NULL,
  application_type  ENUM('Extension of Approval (EOA)','New Technical Institution','Increase in Approved Intake','Introduction of Emerging Tech','Closure / Site Relocation') NOT NULL,
  program           ENUM('Engineering & Technology','Management','MCA','Pharmacy','Architecture') NOT NULL,
  applied_intake    INT          NOT NULL DEFAULT 0,
  current_intake    INT          NOT NULL DEFAULT 0,
  submission_date   DATE         NOT NULL,
  last_updated      DATE         NOT NULL,
  status            ENUM('Pending Scrutiny','Under Review','Action Required','Approved','Returned for Correction','Escalated') NOT NULL DEFAULT 'Pending Scrutiny',
  assigned_reviewer VARCHAR(255) NOT NULL,
  reviewer_role     VARCHAR(255) NOT NULL,
  discrepancy_count INT          NOT NULL DEFAULT 0,
  reviewer_notes    TEXT,
  created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id              VARCHAR(50)  PRIMARY KEY,
  application_id  VARCHAR(50)  NOT NULL,
  name            VARCHAR(255) NOT NULL,
  type            VARCHAR(20)  NOT NULL DEFAULT 'PDF',
  category        ENUM('Land & Legal','Building & Safety','Faculty & Cadre','Finance & FDR','Affiliation') NOT NULL,
  file_size       VARCHAR(20)  NOT NULL DEFAULT '0 KB',
  file_path       VARCHAR(500),
  upload_date     DATE         NOT NULL,
  status          ENUM('Verified','Flagged','Under Inspection','Missing') NOT NULL DEFAULT 'Under Inspection',
  ocr_status      VARCHAR(100) NOT NULL DEFAULT 'Pending',
  pages           INT          NOT NULL DEFAULT 1,
  preview_url     VARCHAR(500),
  deficiency_note TEXT,
  sha256_hash     VARCHAR(64),
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  INDEX idx_app (application_id),
  INDEX idx_hash (sha256_hash)
);

CREATE TABLE IF NOT EXISTS extracted_fields (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  document_id     VARCHAR(50)  NOT NULL,
  field_name      VARCHAR(255) NOT NULL,
  extracted_value TEXT         NOT NULL,
  prescribed_norm VARCHAR(255) NOT NULL DEFAULT '',
  status          ENUM('Compliant','Discrepancy','Missing','Unverified') NOT NULL DEFAULT 'Unverified',
  confidence      FLOAT        NOT NULL DEFAULT 0.0,
  clause_ref      VARCHAR(100) NOT NULL DEFAULT '',
  page_number     INT          NOT NULL DEFAULT 1,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  INDEX idx_doc (document_id)
);

CREATE TABLE IF NOT EXISTS anomalies (
  id                VARCHAR(50)  PRIMARY KEY,
  application_id    VARCHAR(50)  NOT NULL,
  institution_name  VARCHAR(255) NOT NULL,
  title             VARCHAR(255) NOT NULL,
  description       TEXT         NOT NULL,
  severity          ENUM('High','Medium','Low','Advisory') NOT NULL DEFAULT 'Medium',
  evidence          TEXT         NOT NULL,
  clause            VARCHAR(100) NOT NULL DEFAULT '',
  detected_at       VARCHAR(100) NOT NULL,
  resolution_status ENUM('Unresolved','Investigating','Accepted with Justification','Resolved') NOT NULL DEFAULT 'Unresolved',
  action_taken      TEXT,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  INDEX idx_app (application_id)
);

CREATE TABLE IF NOT EXISTS compliance_rules (
  id                   VARCHAR(50)  PRIMARY KEY,
  code                 VARCHAR(50)  NOT NULL,
  name                 VARCHAR(255) NOT NULL,
  category             VARCHAR(100) NOT NULL,
  aph_chapter          VARCHAR(255) NOT NULL,
  version              VARCHAR(100) NOT NULL,
  description          TEXT         NOT NULL,
  prescribed_threshold VARCHAR(255) NOT NULL,
  is_active            BOOLEAN      NOT NULL DEFAULT TRUE,
  severity_if_violated ENUM('High','Medium','Low','Advisory') NOT NULL DEFAULT 'Medium',
  last_updated         DATE         NOT NULL
);

CREATE TABLE IF NOT EXISTS compliance_checks (
  id                    VARCHAR(50)  PRIMARY KEY,
  application_id        VARCHAR(50)  NOT NULL,
  clause                VARCHAR(100) NOT NULL,
  category              VARCHAR(100) NOT NULL,
  requirement           TEXT         NOT NULL,
  institution_submitted TEXT         NOT NULL,
  result                ENUM('Compliant','Deficit','Reviewer Discretion','Pending Verification') NOT NULL DEFAULT 'Pending Verification',
  evidence_source       VARCHAR(500) NOT NULL,
  notes                 TEXT,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  INDEX idx_app (application_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id              VARCHAR(50)  PRIMARY KEY,
  timestamp       VARCHAR(100) NOT NULL,
  officer_name    VARCHAR(255) NOT NULL,
  officer_role    VARCHAR(255) NOT NULL,
  application_id  VARCHAR(50)  NOT NULL,
  action          VARCHAR(255) NOT NULL,
  details         TEXT         NOT NULL,
  ip_address      VARCHAR(100) NOT NULL,
  hash_signature  VARCHAR(100) NOT NULL,
  INDEX idx_app (application_id)
);

CREATE TABLE IF NOT EXISTS document_hashes (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  sha256_hash     VARCHAR(64)  NOT NULL,
  document_id     VARCHAR(50)  NOT NULL,
  application_id  VARCHAR(50)  NOT NULL,
  file_name       VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_hash (sha256_hash),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS issuer_verifications (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  document_id         VARCHAR(50)  NOT NULL,
  issuer_type         VARCHAR(100) NOT NULL,
  verification_method VARCHAR(100) NOT NULL DEFAULT 'manual',
  status              ENUM('verified','mismatch_detected','expired','verification_pending','source_unavailable','manual_review_required') NOT NULL DEFAULT 'verification_pending',
  source_name         VARCHAR(255) NOT NULL,
  source_response     TEXT,
  verified_at         TIMESTAMP    NULL,
  created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  INDEX idx_doc (document_id)
);

-- Demonstration Data Inserts (for testing and development purposes)

INSERT IGNORE INTO applications VALUES
('APP-2026-AICTE-0842','1-4392817291','Apex Institute of Technology & Advanced Studies','Western','Maharashtra','Increase in Approved Intake','Engineering & Technology',420,300,'2026-02-14','2026-03-02','Action Required','Dr. Ramanathan S.','Senior Scrutiny Officer (RO Mumbai)',2,'Faculty cadre ratio in Dept of Computer Science fails AICTE APH Clause 5.2. Land title deed verified compliant with 7.5 contiguous acres.',NOW()),
('APP-2026-AICTE-1109','1-9382103982','Coimbatore Institute of Engineering & Robotics','Southern','Tamil Nadu','Introduction of Emerging Tech','Engineering & Technology',60,240,'2026-02-18','2026-03-01','Pending Scrutiny','Er. Sunita Deshmukh','Scrutiny Officer (RO Chennai)',0,'New course application for B.Tech Artificial Intelligence & Machine Learning (60 seats). Laboratory equipment invoices submitted.',NOW()),
('APP-2026-AICTE-0941','1-8492019482','Gurugram School of Management & Technology','North-West','Haryana','Extension of Approval (EOA)','Management',180,180,'2026-02-10','2026-02-28','Approved','Prof. K. Venkatesh','Principal Scrutiny Officer',0,'EOA 2026-27 validated. All 18 compliance parameters conform to APH Chapter II norms without deficiencies.',NOW()),
('APP-2026-AICTE-1340','1-7482910394','Deccan Polytechnic & Technical Campus','South-Western','Karnataka','Extension of Approval (EOA)','Engineering & Technology',240,240,'2026-02-22','2026-03-03','Escalated','Dr. Ramanathan S.','Senior Scrutiny Officer (RO Mumbai)',3,'Escalated to Standing Complaint Committee: Potential ghost faculty detected. 2 faculty members registered simultaneously at an Andhra Pradesh institution.',NOW()),
('APP-2026-AICTE-1422','1-6382019482','Kolkata Metropolitan Institute of Science & Research','Eastern','West Bengal','New Technical Institution','Engineering & Technology',360,0,'2026-02-25','2026-03-02','Under Review','Er. Sunita Deshmukh','Scrutiny Officer (RO Chennai)',1,'New institution scrutiny under Chapter I of APH. Land conversion certificate pending verification with District Collectorate portal.',NOW()),
('APP-2026-AICTE-0711','1-5291039481','Indira Memorial College of Pharmacy','Central','Madhya Pradesh','Extension of Approval (EOA)','Pharmacy',100,100,'2026-02-05','2026-02-20','Returned for Correction','Prof. K. Venkatesh','Principal Scrutiny Officer',2,'Returned to applicant for missing Animal House approval certificate (CPCSEA) and Pharmacognosy lab gas line safety certificate.',NOW());


INSERT IGNORE INTO documents (id,application_id,name,type,category,file_size,upload_date,status,ocr_status,pages,deficiency_note,sha256_hash) VALUES
('DOC-01','APP-2026-AICTE-0842','Land_Title_Sale_Deed_Khasra_84.pdf','PDF','Land & Legal','14.2 MB','2026-02-14','Verified','Processed (100% confidence)',34,NULL,'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'),
('DOC-02','APP-2026-AICTE-0842','Fire_Safety_NOC_Chief_Fire_Officer.pdf','PDF','Building & Safety','4.8 MB','2026-02-14','Flagged','Needs Clarification',8,'Certificate expired on 15-Jan-2026. Renewal receipt dated 02-Feb-2026 attached without Chief Fire Officer endorsement.','b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3'),
('DOC-03','APP-2026-AICTE-0842','Faculty_Cadre_Roster_Aadhaar_Verified.pdf','PDF','Faculty & Cadre','8.1 MB','2026-02-15','Flagged','Processed (100% confidence)',42,'Cadre ratio deficit: Applied for 420 intake requires 3 Professors in CSE. Only 1 Professor on regular appointment roster.','c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4'),
('DOC-04','APP-2026-AICTE-0842','Joint_FDR_Security_AICTE_RO.pdf','PDF','Finance & FDR','2.4 MB','2026-02-14','Verified','Processed (100% confidence)',4,NULL,'d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5'),
('DOC-11','APP-2026-AICTE-1109','Lab_Infrastructure_AI_GPU_Invoices.pdf','PDF','Building & Safety','6.7 MB','2026-02-18','Verified','Processed (100% confidence)',16,NULL,'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6'),
('DOC-12','APP-2026-AICTE-1109','University_Affiliation_Approval_AnnaUniv.pdf','PDF','Affiliation','3.1 MB','2026-02-18','Verified','Processed (100% confidence)',6,NULL,'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1'),
('DOC-21','APP-2026-AICTE-0941','EOA_Annual_Self_Disclosure_2026.pdf','PDF','Land & Legal','12.0 MB','2026-02-10','Verified','Processed (100% confidence)',58,NULL,'a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3'),
('DOC-31','APP-2026-AICTE-1340','Faculty_Declaration_Forms_Affidavit.pdf','PDF','Faculty & Cadre','15.4 MB','2026-02-22','Flagged','Needs Clarification',64,'Aadhaar ID cross-match flagged duplicate employment for Prof. M. Suresh and Asst. Prof. Priya Nair.','b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4'),
('DOC-41','APP-2026-AICTE-1422','Land_Conversion_Order_Govt_WB.pdf','PDF','Land & Legal','5.2 MB','2026-02-25','Under Inspection','Needs Clarification',12,'Digital QR on state revenue order requires live API ping confirmation from BanglarBhumi database.','c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5'),
('DOC-51','APP-2026-AICTE-0711','PCI_Approval_and_CPCSEA_Letter.pdf','PDF','Building & Safety','3.9 MB','2026-02-05','Flagged','Needs Clarification',9,'CPCSEA clearance letter expired in Dec 2025. Animal house inspection report missing.','d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6');


INSERT IGNORE INTO extracted_fields (document_id,field_name,extracted_value,prescribed_norm,status,confidence,clause_ref,page_number) VALUES
('DOC-01','Contiguous Land Area','7.50 Acres','Min 5.0 Acres (Non-Metro)','Compliant',0.99,'APH Sec 4.1',4),
('DOC-01','Land Ownership Type','Clear Title (Freehold)','Freehold or 30-year Govt Lease','Compliant',0.98,'APH Sec 4.2',6),
('DOC-01','Non-Encumbrance Certificate','Valid up to 2050 (Sub-Registrar)','Current & Unencumbered','Compliant',0.96,'APH Sec 4.4',12),
('DOC-02','NOC Validity Date','15-Jan-2026 (Expired)','Valid on scrutiny date','Discrepancy',0.94,'APH Sec 6.1',2),
('DOC-02','Fire Sprinkler Coverage','Installed (Labs & Seminar)','All Academic Blocks','Compliant',0.92,'NBC 2016 Part 4',5),
('DOC-03','Faculty Student Ratio (FSR)','1 : 16.2','1 : 15 (Engineering UG)','Discrepancy',0.97,'APH Sec 5.1',18),
('DOC-03','Cadre Ratio (Prof:Assoc:Asst)','1 : 2 : 14 (CSE)','1 : 2 : 6','Discrepancy',0.95,'APH Sec 5.2',19),
('DOC-03','Biometric Attendance Integration','Live linked to University','Mandatory','Compliant',0.99,'APH Sec 5.7',31),
('DOC-04','Joint FDR Value','₹1,50,00,000/-','₹1.50 Crore','Compliant',0.99,'APH Sec 8.1',1),
('DOC-04','Lien in favour of Regional Officer','Confirmed (SBI Mumbai Main)','RO AICTE Joint Account','Compliant',0.98,'APH Sec 8.2',2),
('DOC-11','High-Performance Workstations','40 Units (NVIDIA RTX)','Min 30 Units for 60 batch','Compliant',0.99,'APH Sec 6.4',3),
('DOC-11','Licensed Software / Open Source Frameworks','CUDA, PyTorch, ROS2','Mandatory AI Labs','Compliant',0.97,'APH Sec 6.5',7),
('DOC-12','Affiliating University Consent','Approved for 2026-27','Mandatory NOC','Compliant',0.98,'APH Sec 3.2',1),
('DOC-21','Total Built-up Area','18,450 sq.m.','Min 12,000 sq.m.','Compliant',0.99,'APH Sec 4.3',11),
('DOC-21','Library Digital Subscriptions','EBSCO, ProQuest, Harvard Cases','Min 2 Digital Packages','Compliant',0.99,'APH Sec 6.8',24),
('DOC-31','Cross-Institutional Faculty Match','Duplicate Found (SVEC Tirupati)','Single Exclusive Employment','Discrepancy',0.99,'APH Sec 5.8',12),
('DOC-41','Land Use Conversion','Institutional Use Permitted','Educational / Institutional Classification','Unverified',0.88,'APH Sec 4.2',3),
('DOC-51','CPCSEA Registration','Expired 31-Dec-2025','Valid CPCSEA certification for B.Pharm','Discrepancy',0.96,'PCI / APH Norms',4);

INSERT IGNORE INTO compliance_checks VALUES
('CHK-1','APP-2026-AICTE-0842','APH 4.1','Land Norms','Contiguous land area min 5 acres (Urban/Town)','7.50 contiguous acres','Compliant','Land_Title_Sale_Deed_Khasra_84.pdf, Page 4',NULL),
('CHK-2','APP-2026-AICTE-0842','APH 5.1','Cadre Ratio','Faculty-student ratio 1:15 in Engineering UG','1:16.2 overall, 1:17.1 in CSE','Deficit','Faculty_Cadre_Roster_Aadhaar_Verified.pdf, Page 18','Shortage of 4 full-time faculties'),
('CHK-3','APP-2026-AICTE-0842','APH 5.2','Faculty Cadre','Cadre ratio 1:2:6 per program division','1 Professor, 2 Associate, 14 Assistant in CSE','Deficit','Faculty_Cadre_Roster_Aadhaar_Verified.pdf, Page 19','Deficit of 2 Professors'),
('CHK-4','APP-2026-AICTE-0842','APH 6.1','Safety & Hygiene','Valid Fire NOC issued by Competent Govt Authority','Expired Jan 2026, provisional renewal receipt','Reviewer Discretion','Fire_Safety_NOC_Chief_Fire_Officer.pdf, Page 2',NULL),
('CHK-5','APP-2026-AICTE-0842','APH 7.3','Barrier-Free Access','Lifts, accessible washrooms, ramps for PWD as per NBC 2016','Architectural certificate with 2 lifts + ramps in block A, B','Compliant','Architect_Barrier_Free_Certificate.pdf, Page 3',NULL),
('CHK-6','APP-2026-AICTE-0842','APH 8.1','Financial Viability','Joint Fixed Deposit with AICTE RO lien','₹1.50 Crore SBI Bank FDR with AICTE RO Western lien','Compliant','Joint_FDR_Security_AICTE_RO.pdf, Page 1',NULL),
('CHK-11','APP-2026-AICTE-1109','APH 3.2','Affiliation','Affiliating University NOC for emerging branch','Anna University Syndicate Resolution NOC dated Jan 2026','Compliant','University_Affiliation_Approval_AnnaUniv.pdf, Page 1',NULL),
('CHK-12','APP-2026-AICTE-1109','APH 6.4','Lab Norms','Dedicated computing lab for AI/ML with GPU clusters','40 high-performance GPU workstations with 1 Gbps lease line','Compliant','Lab_Infrastructure_AI_GPU_Invoices.pdf, Page 3',NULL),
('CHK-21','APP-2026-AICTE-0941','APH 4.3','Built-up Area','Built up instructional area >= 12,000 sq.m.','18,450 sq.m. verified through municipal occupancy certificate','Compliant','EOA_Annual_Self_Disclosure_2026.pdf, Page 11',NULL),
('CHK-22','APP-2026-AICTE-0941','APH 5.1','FSR Management','FSR 1:20 for PGDM / MBA programs','1:14.5 with 14 full-time PhD doctorates','Compliant','EOA_Annual_Self_Disclosure_2026.pdf, Page 19',NULL),
('CHK-31','APP-2026-AICTE-1340','APH 5.8','Faculty Integrity','Exclusive full-time regular employment with single AICTE institute','Aadhaar duplicate recorded across 2 institutions','Deficit','Faculty_Declaration_Forms_Affidavit.pdf, Page 12','Severe violation: Hearing notice initiated'),
('CHK-41','APP-2026-AICTE-1422','APH 4.2','Land Norms','Statutory government land use conversion order','Order No. 492/LR/2025 submitted, QR pending API handshake','Pending Verification','Land_Conversion_Order_Govt_WB.pdf, Page 3',NULL),
('CHK-51','APP-2026-AICTE-0711','APH 6.9','Pharmacy Lab Norms','CPCSEA approval for animal house and bio-waste disposal','Expired certificate submitted','Deficit','PCI_Approval_and_CPCSEA_Letter.pdf, Page 4',NULL);


INSERT IGNORE INTO compliance_rules VALUES
('RULE-01','APH-2026-4.1','Minimum Contiguous Land Norm','Land & Legal','Chapter IV: Infrastructure Norms','2026.1 (APH Gazetted)','Institution must possess required contiguous land area in title or registered lease (>=30 yrs) free from legal encumbrance, without intervening public roads.','>= 5.0 Acres (Non-Metro) / >= 2.5 Acres (Metro)',TRUE,'High','2026-01-15'),
('RULE-02','APH-2026-5.1','Faculty-to-Student Ratio (FSR)','Faculty & Cadre','Chapter V: Norms for Faculty Requirements','2026.1 (APH Gazetted)','Institutions offering undergraduate engineering degrees must maintain prescribed full-time faculty to student headcount ratio.','1 : 15 (Undergraduate Engineering & Tech)',TRUE,'High','2026-01-15'),
('RULE-03','APH-2026-5.2','Cadre Structure Compliance','Faculty & Cadre','Chapter V: Faculty Cadre Proportions','2026.1 (APH Gazetted)','For each department/division, faculty must be balanced in the ratio of Professor : Associate Professor : Assistant Professor with UGC/AICTE minimum qualifications.','1 : 2 : 6 (Cadre Distribution)',TRUE,'Medium','2026-01-15'),
('RULE-04','APH-2026-6.1','Statutory Fire & Life Safety Certificate','Building & Safety','Chapter VI: Building & Life Safety Mandates','2026.2 (Updated Safety Directive)','Valid Fire Safety NOC issued by State Chief Fire Officer or Municipal Authority covering academic, administrative, and hostel buildings.','Valid & active on the date of approval scrutiny',TRUE,'High','2026-02-01'),
('RULE-05','APH-2026-7.3','Barrier-Free Physical Environment (PWD)','Building & Safety','Chapter VII: Essential Amenities','2026.1 (APH Gazetted)','As per RPwD Act 2016, campus must provide dedicated wheelchair ramps, accessible elevators with braille indicators, and uni-sex disabled washrooms.','100% Academic & Administrative Block Compliance',TRUE,'Medium','2026-01-15'),
('RULE-06','APH-2026-8.1','Joint Fixed Deposit Security (Security Deposit)','Finance & FDR','Chapter VIII: Financial Viability Norms','2026.1 (APH Gazetted)','Joint FDR in scheduled commercial bank with Regional Officer AICTE for statutory security deposit tenure (minimum 10 years).','₹1.50 Crore (Engg UG) / ₹1.00 Crore (PGDM)',TRUE,'High','2026-01-15'),
('RULE-07','APH-2026-5.8','Single Full-Time Employment Verification','Faculty & Cadre','Chapter V: Integrity & Aadhaar Verification','2026.2 (Anti-Ghost Faculty Protocol)','Faculty members must not appear as full-time regular teachers in more than one AICTE-approved institution simultaneously.','Zero duplicate Aadhaar/PAN roster overlap',TRUE,'High','2026-02-10');

INSERT IGNORE INTO anomalies VALUES
('ANOM-2026-001','APP-2026-AICTE-1340','Deccan Polytechnic & Technical Campus','Duplicate Faculty Aadhaar Cross-Match','Prof. M. Suresh (Aadhaar ending in 8492) identified simultaneously on full-time teaching roster of Deccan Polytechnic and Sri Venkateswara College of Engg, Tirupati.','High','Aadhaar hashed token match across AP and KA state council scrutiny repositories.','APH-2026-5.8','2026-02-23 11:42 IST','Unresolved',NULL),
('ANOM-2026-002','APP-2026-AICTE-0842','Apex Institute of Technology & Advanced Studies','Expired Fire Safety NOC with Unendorsed Renewal Receipt','Chief Fire Officer NOC expired on 15-Jan-2026. Institution submitted a local challan receipt without formal fire department inspection certificate.','High','Fire_Safety_NOC_Chief_Fire_Officer.pdf (Page 2, stamp date mismatch).','APH-2026-6.1','2026-02-16 15:10 IST','Investigating',NULL),
('ANOM-2026-003','APP-2026-AICTE-0842','Apex Institute of Technology & Advanced Studies','Faculty Cadre Imbalance (CSE Dept)','Applied for 420 intake requires minimum 3 Professors and 6 Associate Professors. Institution roster has only 1 Professor and 2 Associate Professors.','Medium','Faculty_Cadre_Roster_Aadhaar_Verified.pdf (Page 19, Roster deficiency calculation).','APH-2026-5.2','2026-02-16 15:14 IST','Unresolved',NULL),
('ANOM-2026-004','APP-2026-AICTE-0711','Indira Memorial College of Pharmacy','Lapsed CPCSEA Animal House Clearance','Pharmacology curriculum requires active CPCSEA approval. Submitted approval lapsed on 31-Dec-2025 without renewed registration certificate.','High','PCI_Approval_and_CPCSEA_Letter.pdf (Page 4, CPCSEA expiry indicator).','APH-2026-6.9','2026-02-08 09:30 IST','Accepted with Justification','Application returned to applicant on 20-Feb-2026 with 14-day cure period.'),
('ANOM-2026-005','APP-2026-AICTE-1422','Kolkata Metropolitan Institute of Science & Research','Land Conversion Order QR Code Unverified','State Revenue Department QR code on Land Conversion Order 492/LR/2025 could not be validated against the BanglarBhumi state land records endpoint.','Medium','Land_Conversion_Order_Govt_WB.pdf (Page 3, QR cryptographic handshake pending).','APH-2026-4.2','2026-02-26 14:05 IST','Investigating',NULL);

INSERT IGNORE INTO audit_logs VALUES
('AUDIT-8921','2026-03-03 10:15:22 IST','Dr. Ramanathan S.','Senior Scrutiny Officer (RO Mumbai)','APP-2026-AICTE-1340','Application Escalated to Standing Committee','Escalation triggered due to verified duplicate Aadhaar ghost-faculty detection under APH Clause 5.8.','10.24.112.45 (NIC-AICTE VPN)','sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'),
('AUDIT-8920','2026-03-02 16:48:10 IST','Dr. Ramanathan S.','Senior Scrutiny Officer (RO Mumbai)','APP-2026-AICTE-0842','Compliance Deficiency Flagged','Flagged Fire Safety NOC expiry and Cadre ratio deficit in Computer Science department.','10.24.112.45 (NIC-AICTE VPN)','sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'),
('AUDIT-8919','2026-03-01 14:20:05 IST','Er. Sunita Deshmukh','Scrutiny Officer (RO Chennai)','APP-2026-AICTE-1109','Document Integrity Verified','GPU Lab infrastructure and Anna University NOC verified compliant with Chapter III emerging tech mandates.','10.24.108.92 (NIC-AICTE VPN)','sha256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'),
('AUDIT-8918','2026-02-28 17:30:44 IST','Prof. K. Venkatesh','Principal Scrutiny Officer','APP-2026-AICTE-0941','EOA 2026-27 Approved','Approved Extension of Approval for Gurugram School of Management & Technology with 180 intake. E-Gazette sign-off registered.','10.24.100.18 (NIC-AICTE HQ New Delhi)','sha256:6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090'),
('AUDIT-8917','2026-02-20 11:12:30 IST','Prof. K. Venkatesh','Principal Scrutiny Officer','APP-2026-AICTE-0711','Application Returned for Correction','Formal deficiency memorandum issued to institution regarding lapsed CPCSEA animal house registration.','10.24.100.18 (NIC-AICTE HQ New Delhi)','sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35');
