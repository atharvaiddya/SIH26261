'use strict';
const { pool } = require('../db');
const { isDateExpired } = require('./ocr-bridge');

async function checkDuplicateHashes(sha256Hash, currentAppId) {
  if (!sha256Hash) return [];
  try {
    const [rows] = await pool.query(
      `SELECT dh.application_id, dh.document_id, dh.file_name
         FROM document_hashes dh
        WHERE dh.sha256_hash = ? AND dh.application_id != ?`,
      [sha256Hash, currentAppId]
    );
    return rows;
  } catch (_) { return []; }
}

async function checkDateAnomalies(extractedFields, applicationId) {
  const anomalies = [];
  for (const f of extractedFields) {
    const val = f.extractedValue || f.extracted_value || '';
    const name = f.fieldName || f.field_name || '';
    if (/expir|valid\s*till|valid\s*up\s*to|validity/i.test(name)) {
      if (isDateExpired(val)) {
        anomalies.push({
          title: `Expired Document Field Detected`,
          description: `Field "${name}" contains date "${val}" which has expired.`,
          severity: 'High',
          evidence: `Extracted field: ${name} = ${val}`,
          clause: 'Document Validity',
        });
      }
    }
  }
  return anomalies;
}

async function checkFacultyCrossReference(extractedFields, currentAppId) {
  const anomalies = [];
  const identifyingFields = extractedFields.filter(f => {
    const name = (f.fieldName || f.field_name || '').toLowerCase();
    return name.includes('aadhaar') || name.includes('pan') || name.includes('faculty') || name.includes('cross');
  });

  for (const field of identifyingFields) {
    const val = (field.extractedValue || field.extracted_value || '').trim();
    if (!val || val.length < 4) continue;
    try {
      const [rows] = await pool.query(
        `SELECT ef.document_id, d.application_id, d.name AS doc_name
           FROM extracted_fields ef
           JOIN documents d ON d.id = ef.document_id
          WHERE ef.extracted_value LIKE ?
            AND d.application_id != ?
          LIMIT 5`,
        [`%${val}%`, currentAppId]
      );
      if (rows.length > 0) {
        anomalies.push({
          title: 'Cross-Application Faculty/Identity Match',
          description: `Value "${val}" in field "${field.fieldName || field.field_name}" was found in ${rows.length} other application(s): ${rows.map(r => r.application_id).join(', ')}.`,
          severity: 'High',
          evidence: `Field match across applications: ${rows.map(r => r.application_id).join(', ')}`,
          clause: 'APH-2026-5.8',
        });
      }
    } catch (_) { /* DB unavailable */ }
  }
  return anomalies;
}

function checkMetadataAnomalies(ocrResults) {
  const anomalies = [];
  if (!ocrResults || ocrResults.length === 0) return anomalies;

  const scores = ocrResults.map(r => r.score || 0);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const min = Math.min(...scores);

  if (avg < 0.5) {
    anomalies.push({
      title: 'Very Low OCR Confidence',
      description: `Average OCR confidence score is ${(avg * 100).toFixed(1)}%. Document may be low quality, photographed at an angle, or digitally altered.`,
      severity: 'Medium',
      evidence: `Average confidence: ${(avg * 100).toFixed(1)}%, Min confidence: ${(min * 100).toFixed(1)}%`,
      clause: 'Document Integrity',
    });
  }

  if (ocrResults.length < 5) {
    anomalies.push({
      title: 'Insufficient Document Content',
      description: `Only ${ocrResults.length} text elements detected. Document may be blank, corrupted, or contain predominantly non-textual content.`,
      severity: 'Low',
      evidence: `Token count: ${ocrResults.length}`,
      clause: 'Document Completeness',
    });
  }

  return anomalies;
}

/**
 * Run all anomaly checks for a newly processed document.
 * @param {object} document          DB document row (needs .sha256_hash, .id)
 * @param {Array}  ocrResults        Raw OCR tokens
 * @param {Array}  extractedFields   Structured extracted fields
 * @param {string} applicationId
 * @returns {Promise<Array>}         Array of anomaly descriptor objects
 */
async function detectAnomalies(document, ocrResults, extractedFields, applicationId) {
  const found = [];

  const dupes = await checkDuplicateHashes(document.sha256_hash, applicationId);
  if (dupes.length > 0) {
    found.push({
      title: 'Duplicate Document Hash Detected',
      description: `This document's SHA-256 fingerprint matches ${dupes.length} document(s) in other applications. This may indicate document reuse or submission of the same file across multiple institutions.`,
      severity: 'High',
      evidence: `SHA-256: ${document.sha256_hash} — matched in: ${dupes.map(d => d.application_id).join(', ')}`,
      clause: 'Document Integrity / Anti-Reuse',
    });
  }

  const dateIssues = await checkDateAnomalies(extractedFields, applicationId);
  found.push(...dateIssues);

  const crossIssues = await checkFacultyCrossReference(extractedFields, applicationId);
  found.push(...crossIssues);

  const metaIssues = checkMetadataAnomalies(ocrResults);
  found.push(...metaIssues);

  return found;
}

module.exports = {
  detectAnomalies,
  checkDuplicateHashes,
  checkDateAnomalies,
  checkFacultyCrossReference,
  checkMetadataAnomalies,
};
