'use strict';
const express = require('express');
const router  = express.Router();
const { pool } = require('../db');
const { randomSignature } = require('../services/hasher');

function mapApp(row) {
  return {
    id:               row.id,
    institutionId:    row.institution_id,
    institutionName:  row.institution_name,
    region:           row.region,
    state:            row.state,
    applicationType:  row.application_type,
    program:          row.program,
    appliedIntake:    row.applied_intake,
    currentIntake:    row.current_intake,
    submissionDate:   row.submission_date instanceof Date
                        ? row.submission_date.toISOString().slice(0,10)
                        : row.submission_date,
    lastUpdated:      row.last_updated instanceof Date
                        ? row.last_updated.toISOString().slice(0,10)
                        : row.last_updated,
    status:           row.status,
    assignedReviewer: row.assigned_reviewer,
    reviewerRole:     row.reviewer_role,
    discrepancyCount: row.discrepancy_count,
    reviewerNotes:    row.reviewer_notes || '',
    documents:        [],
    complianceChecks: [],
  };
}

function mapDoc(row) {
  return {
    id:             row.id,
    name:           row.name,
    type:           row.type,
    category:       row.category,
    fileSize:       row.file_size,
    uploadDate:     row.upload_date instanceof Date
                      ? row.upload_date.toISOString().slice(0,10)
                      : row.upload_date,
    status:         row.status,
    ocrStatus:      row.ocr_status,
    pages:          row.pages,
    previewUrl:     row.preview_url || undefined,
    deficiencyNote: row.deficiency_note || undefined,
    sha256Hash:     row.sha256_hash || undefined,
    extractedFields: [],
  };
}

function mapField(row) {
  return {
    fieldName:      row.field_name,
    extractedValue: row.extracted_value,
    prescribedNorm: row.prescribed_norm,
    status:         row.status,
    confidence:     parseFloat(row.confidence),
    clauseRef:      row.clause_ref,
    pageNumber:     row.page_number,
  };
}

function mapCheck(row) {
  return {
    id:                   row.id,
    clause:               row.clause,
    category:             row.category,
    requirement:          row.requirement,
    institutionSubmitted: row.institution_submitted,
    result:               row.result,
    evidenceSource:       row.evidence_source,
    notes:                row.notes || undefined,
  };
}

router.get('/', async (req, res) => {
  try {
    const [appRows] = await pool.query('SELECT * FROM applications ORDER BY submission_date DESC');
    const [docRows] = await pool.query('SELECT * FROM documents ORDER BY upload_date DESC');
    const [fieldRows] = await pool.query('SELECT * FROM extracted_fields');
    const [checkRows] = await pool.query('SELECT * FROM compliance_checks');

    const fieldsByDoc = {};
    for (const f of fieldRows) {
      if (!fieldsByDoc[f.document_id]) fieldsByDoc[f.document_id] = [];
      fieldsByDoc[f.document_id].push(mapField(f));
    }

    const docsByApp = {};
    for (const d of docRows) {
      if (!docsByApp[d.application_id]) docsByApp[d.application_id] = [];
      const doc = mapDoc(d);
      doc.extractedFields = fieldsByDoc[d.id] || [];
      docsByApp[d.application_id].push(doc);
    }

    const checksByApp = {};
    for (const c of checkRows) {
      if (!checksByApp[c.application_id]) checksByApp[c.application_id] = [];
      checksByApp[c.application_id].push(mapCheck(c));
    }

    const result = appRows.map(r => {
      const app = mapApp(r);
      app.documents        = docsByApp[app.id]   || [];
      app.complianceChecks = checksByApp[app.id] || [];
      return app;
    });

    res.json(result);
  } catch (err) {
    console.error('[applications GET /]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[app]] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const [docs]   = await pool.query('SELECT * FROM documents WHERE application_id = ?', [id]);
    const [checks] = await pool.query('SELECT * FROM compliance_checks WHERE application_id = ?', [id]);

    const result = mapApp(app);
    for (const d of docs) {
      const [fields] = await pool.query('SELECT * FROM extracted_fields WHERE document_id = ?', [d.id]);
      const doc = mapDoc(d);
      doc.extractedFields = fields.map(mapField);
      result.documents.push(doc);
    }
    result.complianceChecks = checks.map(mapCheck);

    res.json(result);
  } catch (err) {
    console.error('[applications GET /:id]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const b = req.body;
    const id = `APP-${new Date().getFullYear()}-AICTE-${Math.floor(1000 + Math.random() * 9000)}`;
    await pool.query(
      `INSERT INTO applications
         (id, institution_id, institution_name, region, state, application_type, program,
          applied_intake, current_intake, submission_date, last_updated, status,
          assigned_reviewer, reviewer_role, discrepancy_count, reviewer_notes)
       VALUES (?,?,?,?,?,?,?,?,?,CURDATE(),CURDATE(),?,?,?,0,?)`,
      [id, b.institutionId || '', b.institutionName, b.region, b.state,
       b.applicationType, b.program, b.appliedIntake || 0, b.currentIntake || 0,
       b.status || 'Pending Scrutiny', b.assignedReviewer || '', b.reviewerRole || '', b.reviewerNotes || '']
    );
    const [[row]] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    res.status(201).json(mapApp(row));
  } catch (err) {
    console.error('[applications POST /]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, officerName, officerRole } = req.body;

    await pool.query(
      'UPDATE applications SET status = ?, reviewer_notes = ?, last_updated = CURDATE() WHERE id = ?',
      [status, notes || '', id]
    );

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    const sig       = randomSignature();
    const auditId   = `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`;

    await pool.query(
      `INSERT INTO audit_logs (id, timestamp, officer_name, officer_role, application_id, action, details, ip_address, hash_signature)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [auditId, timestamp, officerName || 'System', officerRole || 'System',
       id, `Status Updated to "${status}"`,
       notes || `Scrutiny officer executed decision for ${id}.`,
       '10.24.112.45 (NIC-AICTE VPN)', `sha256:${sig}`]
    );

    const [[updated]] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    res.json(mapApp(updated));
  } catch (err) {
    console.error('[applications PUT /:id/status]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
