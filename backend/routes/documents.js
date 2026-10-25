'use strict';
const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const { pool } = require('../db');
const { hashFile }                               = require('../services/hasher');
const { runOCR, classifyDocument, extractFields } = require('../services/ocr-bridge');
const { detectAnomalies }                         = require('../services/anomaly-detector');
const { verifyDocument }                          = require('../services/issuer-adapter');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/upload', upload.single('document'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { applicationId, category } = req.body;
  if (!applicationId) return res.status(400).json({ error: 'applicationId is required' });

  const filePath   = req.file.path;
  const fileName   = req.file.originalname || req.file.filename;
  const fileSize   = `${(req.file.size / 1024 / 1024).toFixed(1)} MB`;
  const ext        = path.extname(fileName).replace('.', '').toUpperCase() || 'FILE';
  const docId      = `DOC-${Date.now()}`;

  try {
    const sha256 = await hashFile(filePath);

    let ocrResults = [];
    try { ocrResults = await runOCR(filePath); } catch (_) {}

    const docType       = classifyDocument(ocrResults);
    const fields        = extractFields(ocrResults, docType);
    const avgConf       = ocrResults.length
      ? (ocrResults.reduce((s, r) => s + (r.score || 0), 0) / ocrResults.length)
      : 0.9;
    const ocrStatusStr  = ocrResults.length === 0
      ? 'OCR Unavailable'
      : avgConf >= 0.85
        ? 'Processed (100% confidence)'
        : 'Needs Clarification';

    await pool.query(
      `INSERT INTO documents
         (id, application_id, name, type, category, file_size, file_path, upload_date,
          status, ocr_status, pages, sha256_hash)
       VALUES (?,?,?,?,?,?,?,CURDATE(),'Under Inspection',?,1,?)`,
      [docId, applicationId, fileName, ext,
       category || 'Land & Legal', fileSize, filePath, ocrStatusStr, sha256]
    );

    await pool.query(
      `INSERT INTO document_hashes (sha256_hash, document_id, application_id, file_name)
       VALUES (?,?,?,?)`,
      [sha256, docId, applicationId, fileName]
    );

    if (fields.length > 0) {
      const vals = fields.map(f => [docId, f.fieldName, f.extractedValue,
                                    f.prescribedNorm || '', f.status || 'Unverified',
                                    f.confidence || 0.9, f.clauseRef || '', f.pageNumber || 1]);
      await pool.query(
        `INSERT INTO extracted_fields
           (document_id, field_name, extracted_value, prescribed_norm, status, confidence, clause_ref, page_number)
         VALUES ?`,
        [vals]
      );
    }
    const docRow = { id: docId, sha256_hash: sha256, name: fileName, category: category || '' };
    const anomalyList = await detectAnomalies(docRow, ocrResults, fields, applicationId);

    for (const a of anomalyList) {
      const aid = `ANOM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const [[appRow]] = await pool.query('SELECT institution_name FROM applications WHERE id = ?', [applicationId]);
      const instName = appRow ? appRow.institution_name : applicationId;
      try {
        await pool.query(
          `INSERT INTO anomalies (id, application_id, institution_name, title, description, severity, evidence, clause, detected_at, resolution_status)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [aid, applicationId, instName, a.title, a.description,
           a.severity || 'Medium', a.evidence || '', a.clause || '',
           new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
           'Unresolved']
        );
      } catch (_) { /* duplicate key etc. — skip */ }
    }

    // 9. Build response
    const [[savedDoc]] = await pool.query('SELECT * FROM documents WHERE id = ?', [docId]);
    const [savedFields] = await pool.query('SELECT * FROM extracted_fields WHERE document_id = ?', [docId]);

    res.status(201).json({
      document: {
        id:              savedDoc.id,
        name:            savedDoc.name,
        type:            savedDoc.type,
        category:        savedDoc.category,
        fileSize:        savedDoc.file_size,
        uploadDate:      savedDoc.upload_date,
        status:          savedDoc.status,
        ocrStatus:       savedDoc.ocr_status,
        pages:           savedDoc.pages,
        sha256Hash:      savedDoc.sha256_hash,
        extractedFields: savedFields.map(f => ({
          fieldName:      f.field_name,
          extractedValue: f.extracted_value,
          prescribedNorm: f.prescribed_norm,
          status:         f.status,
          confidence:     parseFloat(f.confidence),
          clauseRef:      f.clause_ref,
          pageNumber:     f.page_number,
        })),
      },
      docType,
      ocrTokenCount: ocrResults.length,
      anomaliesDetected: anomalyList.length,
      anomalies: anomalyList,
    });
  } catch (err) {
    console.error('[documents POST /upload]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [[doc]] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const [fields]  = await pool.query('SELECT * FROM extracted_fields WHERE document_id = ?', [id]);
    const [verifs]  = await pool.query('SELECT * FROM issuer_verifications WHERE document_id = ? ORDER BY created_at DESC LIMIT 5', [id]);

    res.json({
      id:              doc.id,
      applicationId:   doc.application_id,
      name:            doc.name,
      type:            doc.type,
      category:        doc.category,
      fileSize:        doc.file_size,
      uploadDate:      doc.upload_date,
      status:          doc.status,
      ocrStatus:       doc.ocr_status,
      pages:           doc.pages,
      sha256Hash:      doc.sha256_hash,
      deficiencyNote:  doc.deficiency_note,
      extractedFields: fields.map(f => ({
        fieldName:      f.field_name,
        extractedValue: f.extracted_value,
        prescribedNorm: f.prescribed_norm,
        status:         f.status,
        confidence:     parseFloat(f.confidence),
        clauseRef:      f.clause_ref,
        pageNumber:     f.page_number,
      })),
      verifications: verifs,
    });
  } catch (err) {
    console.error('[documents GET /:id]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const [[doc]] = await pool.query('SELECT * FROM documents WHERE id = ?', [id]);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const [fields] = await pool.query('SELECT * FROM extracted_fields WHERE document_id = ?', [id]);
    const result   = await verifyDocument(doc, fields);

    await pool.query(
      `INSERT INTO issuer_verifications
         (document_id, issuer_type, verification_method, status, source_name, source_response, verified_at)
       VALUES (?,?,?,?,?,?,?)`,
      [id, req.body.issuerType || 'auto', 'api',
       result.status, result.source_name,
       result.source_response ? result.source_response.slice(0, 2000) : null,
       result.status === 'verified' ? new Date() : null]
    );

    let newDocStatus = doc.status;
    if (result.status === 'verified')  newDocStatus = 'Verified';
    if (result.status === 'expired')   newDocStatus = 'Flagged';
    if (newDocStatus !== doc.status) {
      await pool.query('UPDATE documents SET status = ? WHERE id = ?', [newDocStatus, id]);
    }

    res.json({ verificationResult: result, documentStatus: newDocStatus });
  } catch (err) {
    console.error('[documents POST /:id/verify]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/ocr/extract', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  try {
    const ocrResults = await runOCR(req.file.path);
    const docType    = classifyDocument(ocrResults);
    const fields     = extractFields(ocrResults, docType);
    const sha256     = await hashFile(req.file.path);
    res.json({ sha256, docType, ocrTokenCount: ocrResults.length, rawOcr: ocrResults, extractedFields: fields });
  } catch (err) {
    console.error('[documents POST /ocr/extract]', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
