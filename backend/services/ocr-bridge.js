'use strict';
const { spawn } = require('child_process');
const path      = require('path');

const OCR_SCRIPT = path.join(__dirname, '../../python/ocr.py');


async function runOCR(filePath) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';

    const proc = spawn('python3', [OCR_SCRIPT, filePath], {
      timeout: 60000,
    });

    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });

    proc.on('error', (err) => {
      console.warn('[OCR] Spawn error (Python unavailable?):', err.message);
      resolve([]);
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        console.warn('[OCR] Exit code', code, '— stderr:', stderr.slice(0, 200));
        resolve([]);
        return;
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.warn('[OCR] JSON parse error:', e.message);
        resolve([]);
      }
    });
  });
}


function classifyDocument(ocrResults) {
  const full = ocrResults.map(r => (r.text || '')).join(' ').toLowerCase();

  if (full.includes('extension of approval') || (full.includes('aicte') && full.includes('eoa')))
    return 'EOA';
  if (full.includes('registration certificate') || (full.includes('tveta') || full.includes('registration no')))
    return 'Registration Certificate';
  if (full.includes('certificate of accreditation') || full.includes('accrediting body'))
    return 'Accreditation Certificate';
  if ((full.includes('fire') || full.includes('noc')) && full.includes('safety'))
    return 'Fire Safety NOC';
  if (full.includes('treasury') || full.includes('challan') || (full.includes('bank') && full.includes('payment')))
    return 'Treasury Receipt';
  if (full.includes('land') && (full.includes('title') || full.includes('deed') || full.includes('conversion')))
    return 'Land Document';
  if (full.includes('faculty') || full.includes('cadre') || full.includes('aadhaar') && full.includes('roster'))
    return 'Faculty Roster';
  if (full.includes('fixed deposit') || full.includes('fdr') || full.includes('lien'))
    return 'FDR Certificate';
  if (full.includes('affiliation') && (full.includes('university') || full.includes('syndicate')))
    return 'Affiliation Certificate';
  if (full.includes('animal house') || full.includes('cpcsea'))
    return 'CPCSEA Certificate';
  return 'Other';
}


function findValueAfterLabel(tokens, labelPattern) {
  for (let i = 0; i < tokens.length; i++) {
    if (labelPattern.test(tokens[i].text)) {
      for (let j = i + 1; j < Math.min(i + 4, tokens.length); j++) {
        const val = tokens[j].text.trim();
        if (val && !labelPattern.test(val)) return { value: val, confidence: tokens[j].score };
      }
    }
  }
  return null;
}

function findPattern(tokens, pattern) {
  for (const t of tokens) {
    const m = t.text.match(pattern);
    if (m) return { value: m[0], confidence: t.score };
  }
  return null;
}

function avgConfidence(ocrResults) {
  if (!ocrResults.length) return 0.9;
  return ocrResults.reduce((s, r) => s + (r.score || 0), 0) / ocrResults.length;
}

function extractEOAFields(tokens, fields) {
  const conf = avgConfidence(tokens);

  const permId = findValueAfterLabel(tokens, /permanent\s*id/i) ||
                 findPattern(tokens, /1-\d{7,12}/);
  if (permId) fields.push({ fieldName: 'Permanent ID', extractedValue: permId.value, prescribedNorm: '', status: 'Unverified', confidence: permId.confidence, clauseRef: '', pageNumber: 1 });

  const appId = findValueAfterLabel(tokens, /application\s*id/i);
  if (appId) fields.push({ fieldName: 'Application ID', extractedValue: appId.value, prescribedNorm: '', status: 'Unverified', confidence: appId.confidence, clauseRef: '', pageNumber: 1 });

  const instName = findValueAfterLabel(tokens, /name of the institution/i);
  if (instName) fields.push({ fieldName: 'Institution Name', extractedValue: instName.value, prescribedNorm: '', status: 'Unverified', confidence: instName.confidence, clauseRef: '', pageNumber: 1 });

  const instType = findValueAfterLabel(tokens, /institution\s*type/i);
  if (instType) fields.push({ fieldName: 'Institution Type', extractedValue: instType.value, prescribedNorm: '', status: 'Unverified', confidence: instType.confidence, clauseRef: '', pageNumber: 1 });

  const region = findValueAfterLabel(tokens, /\bregion\b/i);
  if (region) fields.push({ fieldName: 'Region', extractedValue: region.value, prescribedNorm: '', status: 'Unverified', confidence: region.confidence, clauseRef: '', pageNumber: 1 });

  const yearEst = findValueAfterLabel(tokens, /year of establishment/i) ||
                  findPattern(tokens, /\b(19|20)\d{2}\b/);
  if (yearEst) fields.push({ fieldName: 'Year of Establishment', extractedValue: yearEst.value, prescribedNorm: '', status: 'Unverified', confidence: yearEst.confidence, clauseRef: '', pageNumber: 1 });

  const approvalDate = findValueAfterLabel(tokens, /date of approval/i) ||
                       findPattern(tokens, /\d{2}[\/\-]\d{2}[\/\-]\d{4}/);
  if (approvalDate) fields.push({ fieldName: 'Date of Approval', extractedValue: approvalDate.value, prescribedNorm: '', status: 'Unverified', confidence: approvalDate.confidence, clauseRef: 'APH Sec 1.1', pageNumber: 1 });
}

function extractRegistrationFields(tokens, fields) {
  const regNum = findPattern(tokens, /[A-Z]{2,}\/[A-Z]+\/[A-Z]+\/\d+\/\d+/);
  if (regNum) fields.push({ fieldName: 'Registration Number', extractedValue: regNum.value, prescribedNorm: '', status: 'Unverified', confidence: regNum.confidence, clauseRef: '', pageNumber: 1 });

  const regDate = findValueAfterLabel(tokens, /date of registration/i) ||
                  findPattern(tokens, /\d{1,2}[\/\-]\d{2}[\/\-]\d{4}/);
  if (regDate) fields.push({ fieldName: 'Registration Date', extractedValue: regDate.value, prescribedNorm: '', status: 'Unverified', confidence: regDate.confidence, clauseRef: '', pageNumber: 1 });

  const expiry = findValueAfterLabel(tokens, /expiry\s*date|valid\s*until|valid\s*to/i);
  if (expiry) {
    const expired = isDateExpired(expiry.value);
    fields.push({ fieldName: 'Expiry Date', extractedValue: expiry.value, prescribedNorm: 'Valid on scrutiny date', status: expired ? 'Discrepancy' : 'Compliant', confidence: expiry.confidence, clauseRef: '', pageNumber: 1 });
  }

  const addr = findValueAfterLabel(tokens, /physical\s*address|postal\s*address/i);
  if (addr) fields.push({ fieldName: 'Physical Address', extractedValue: addr.value, prescribedNorm: '', status: 'Unverified', confidence: addr.confidence, clauseRef: '', pageNumber: 1 });
}

function extractAccreditationFields(tokens, fields) {
  const body = findValueAfterLabel(tokens, /accrediting\s*body/i);
  if (body) fields.push({ fieldName: 'Accrediting Body', extractedValue: body.value, prescribedNorm: '', status: 'Unverified', confidence: body.confidence, clauseRef: '', pageNumber: 1 });

  const inst = findValueAfterLabel(tokens, /name of institution/i);
  if (inst) fields.push({ fieldName: 'Institution Name', extractedValue: inst.value, prescribedNorm: '', status: 'Unverified', confidence: inst.confidence, clauseRef: '', pageNumber: 1 });

  const standards = findValueAfterLabel(tokens, /standards\s*met/i);
  if (standards) fields.push({ fieldName: 'Standards Met', extractedValue: standards.value, prescribedNorm: '', status: 'Unverified', confidence: standards.confidence, clauseRef: '', pageNumber: 1 });

  const validity = findValueAfterLabel(tokens, /certification\s*validity|valid\s*from|validity/i) ||
                   findPattern(tokens, /from\s+\w+\s+\d+,\s+\d{4}/i);
  if (validity) {
    fields.push({ fieldName: 'Certification Validity', extractedValue: validity.value, prescribedNorm: 'Active on scrutiny date', status: 'Unverified', confidence: validity.confidence, clauseRef: '', pageNumber: 1 });
  }
}

function extractFireNOCFields(tokens, fields) {
  const nocNum = findValueAfterLabel(tokens, /noc\s*no|certificate\s*no/i) ||
                 findPattern(tokens, /NOC[\s\/\-]\d+/i);
  if (nocNum) fields.push({ fieldName: 'NOC Number', extractedValue: nocNum.value, prescribedNorm: '', status: 'Unverified', confidence: nocNum.confidence, clauseRef: 'APH Sec 6.1', pageNumber: 1 });

  const expiry = findValueAfterLabel(tokens, /valid\s*up\s*to|expiry|valid\s*till/i) ||
                 findPattern(tokens, /\d{1,2}[\/\-]\d{2}[\/\-]\d{4}/);
  if (expiry) {
    const expired = isDateExpired(expiry.value);
    fields.push({ fieldName: 'NOC Validity Date', extractedValue: expiry.value, prescribedNorm: 'Valid on scrutiny date', status: expired ? 'Discrepancy' : 'Compliant', confidence: expiry.confidence, clauseRef: 'APH Sec 6.1', pageNumber: 1 });
  }

  const issuing = findValueAfterLabel(tokens, /issued\s*by|authority/i);
  if (issuing) fields.push({ fieldName: 'Issuing Authority', extractedValue: issuing.value, prescribedNorm: 'Chief Fire Officer / Competent Authority', status: 'Unverified', confidence: issuing.confidence, clauseRef: 'APH Sec 6.1', pageNumber: 1 });
}

function extractTreasuryFields(tokens, fields) {
  const challan = findValueAfterLabel(tokens, /challan\s*(identification|no|number)/i) ||
                  findPattern(tokens, /[A-Z]+\d{15,}/);
  if (challan) fields.push({ fieldName: 'Challan Number (CIN)', extractedValue: challan.value, prescribedNorm: '', status: 'Unverified', confidence: challan.confidence, clauseRef: '', pageNumber: 1 });

  const amount = findValueAfterLabel(tokens, /\bamount\b/i) ||
                 findPattern(tokens, /₹[\s\d,]+|\brs\.?\s*[\d,]+/i);
  if (amount) fields.push({ fieldName: 'Amount', extractedValue: amount.value, prescribedNorm: '', status: 'Unverified', confidence: amount.confidence, clauseRef: '', pageNumber: 1 });

  const bank = findValueAfterLabel(tokens, /name of bank|bank\s*name/i);
  if (bank) fields.push({ fieldName: 'Bank Name', extractedValue: bank.value, prescribedNorm: '', status: 'Unverified', confidence: bank.confidence, clauseRef: '', pageNumber: 1 });

  const txnDate = findValueAfterLabel(tokens, /date\s*and\s*time\s*of\s*transaction|transaction\s*date/i) ||
                  findPattern(tokens, /\d{2}[\/\-]\d{2}[\/\-]\d{4}/);
  if (txnDate) fields.push({ fieldName: 'Transaction Date', extractedValue: txnDate.value, prescribedNorm: '', status: 'Unverified', confidence: txnDate.confidence, clauseRef: '', pageNumber: 1 });

  const crn = findValueAfterLabel(tokens, /cyber\s*receipt\s*no|crn/i);
  if (crn) fields.push({ fieldName: 'Cyber Receipt No (CRN)', extractedValue: crn.value, prescribedNorm: '', status: 'Unverified', confidence: crn.confidence, clauseRef: '', pageNumber: 1 });
}

function extractCPCSEAFields(tokens, fields) {
  const regNum = findValueAfterLabel(tokens, /registration\s*no|cpcsea\s*no/i);
  if (regNum) fields.push({ fieldName: 'CPCSEA Registration No', extractedValue: regNum.value, prescribedNorm: 'Active registration', status: 'Unverified', confidence: regNum.confidence, clauseRef: 'APH Sec 6.9', pageNumber: 1 });

  const expiry = findValueAfterLabel(tokens, /valid\s*till|expiry|valid\s*up\s*to/i) ||
                 findPattern(tokens, /\d{1,2}[\/\-]\d{2}[\/\-]\d{4}/);
  if (expiry) {
    const expired = isDateExpired(expiry.value);
    fields.push({ fieldName: 'CPCSEA Validity', extractedValue: expiry.value, prescribedNorm: 'Valid CPCSEA certification for B.Pharm', status: expired ? 'Discrepancy' : 'Compliant', confidence: expiry.confidence, clauseRef: 'PCI / APH Norms', pageNumber: 1 });
  }
}

function extractGenericFields(tokens, fields) {
  const dateMatches = findPattern(tokens, /\d{1,2}[\/\-]\d{2}[\/\-]\d{4}/);
  if (dateMatches) fields.push({ fieldName: 'Detected Date', extractedValue: dateMatches.value, prescribedNorm: '', status: 'Unverified', confidence: dateMatches.confidence, clauseRef: '', pageNumber: 1 });

  const amtMatch = findPattern(tokens, /₹[\s\d,]+|\brs\.?\s*[\d,]+/i);
  if (amtMatch) fields.push({ fieldName: 'Detected Amount', extractedValue: amtMatch.value, prescribedNorm: '', status: 'Unverified', confidence: amtMatch.confidence, clauseRef: '', pageNumber: 1 });
}

function isDateExpired(dateStr) {
  try {
    // support DD/MM/YYYY, DD-MM-YYYY, Month D, YYYY
    let d;
    const parts = dateStr.match(/(\d{1,2})[\/\-](\d{2})[\/\-](\d{2,4})/);
    if (parts) {
      d = new Date(`${parts[3]}-${parts[2].padStart(2,'0')}-${parts[1].padStart(2,'0')}`);
    } else {
      d = new Date(dateStr);
    }
    return !isNaN(d.getTime()) && d < new Date();
  } catch (_) { return false; }
}


/**
 * Extract AICTE-relevant fields from OCR tokens based on the document type.
 * @param {Array} ocrResults  — array of { text, score, box }
 * @param {string} docType    — result of classifyDocument()
 * @returns {Array}           — array of ExtractedField objects
 */
function extractFields(ocrResults, docType) {
  const fields = [];
  const tokens = ocrResults;

  switch (docType) {
    case 'EOA':                    extractEOAFields(tokens, fields);            break;
    case 'Registration Certificate': extractRegistrationFields(tokens, fields); break;
    case 'Accreditation Certificate': extractAccreditationFields(tokens, fields); break;
    case 'Fire Safety NOC':         extractFireNOCFields(tokens, fields);       break;
    case 'Treasury Receipt':        extractTreasuryFields(tokens, fields);      break;
    case 'CPCSEA Certificate':      extractCPCSEAFields(tokens, fields);        break;
    default:                        extractGenericFields(tokens, fields);       break;
  }

  return fields;
}

module.exports = { runOCR, classifyDocument, extractFields, isDateExpired };
