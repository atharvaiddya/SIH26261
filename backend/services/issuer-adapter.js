'use strict';
const { isDateExpired } = require('./ocr-bridge');

const ISSUER_REGISTRY = {
  fire_department: {
    name: 'State Chief Fire Officer / Municipal Authority',
    methods: ['certificate_number', 'manual'],
    verifyUrl: null,
  },
  university: {
    name: 'Affiliating University Portal',
    methods: ['reference_number', 'api'],
    verifyUrl: null,
  },
  revenue_department: {
    name: 'State Revenue Department (BanglarBhumi / SRO)',
    methods: ['qr_code', 'reference_number'],
    verifyUrl: null,
  },
  cpcsea: {
    name: 'CPCSEA — Committee for the Purpose of Control and Supervision of Experiments on Animals',
    methods: ['registration_number'],
    verifyUrl: null,
  },
  bank: {
    name: 'Scheduled Commercial Bank (FDR Lien Verification)',
    methods: ['fdr_number', 'lien_verification'],
    verifyUrl: null,
  },
  aicte: {
    name: 'AICTE Internal Records',
    methods: ['permanent_id', 'application_id'],
    verifyUrl: null,
  },
  pci: {
    name: 'Pharmacy Council of India',
    methods: ['registration_number'],
    verifyUrl: null,
  },
};

function getIssuerType(docType, category) {
  const t = (docType || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (t.includes('fire') || t.includes('noc'))           return 'fire_department';
  if (t.includes('affiliation') || t.includes('university')) return 'university';
  if (t.includes('land') || t.includes('revenue'))        return 'revenue_department';
  if (t.includes('cpcsea') || t.includes('pci'))          return 'cpcsea';
  if (t.includes('fdr') || t.includes('deposit'))         return 'bank';
  if (t.includes('eoa') || t.includes('aicte'))           return 'aicte';
  if (c.includes('finance'))                              return 'bank';
  if (c.includes('affiliation'))                          return 'university';
  if (c.includes('land'))                                 return 'revenue_department';
  if (c.includes('building'))                             return 'fire_department';
  return 'manual';
}

/**
 * Simulate verification of a specific field value against its issuing authority.
 */
async function verifyField(fieldName, fieldValue, issuerType) {

  const expired = isDateExpired(fieldValue);
  if (expired) {
    return { status: 'expired', reason: `Value "${fieldValue}" is an expired date.` };
  }

  if (fieldName.toLowerCase().includes('permanent id') || fieldName.toLowerCase().includes('application id')) {
    if (/^1-\d{7,12}$/.test(fieldValue)) {
      return { status: 'verified', reason: 'AICTE Permanent ID format matches.' };
    }
    return { status: 'mismatch_detected', reason: 'AICTE ID format does not match expected pattern (1-XXXXXXXXX).' };
  }

  if (fieldName.toLowerCase().includes('challan') || fieldName.toLowerCase().includes('cin')) {
    if (fieldValue && fieldValue.length > 10) {
      return { status: 'verified', reason: 'Challan number format valid.' };
    }
    return { status: 'mismatch_detected', reason: 'Challan number too short or invalid.' };
  }

  if (issuerType === 'manual' || !ISSUER_REGISTRY[issuerType]) {
    return { status: 'manual_review_required', reason: 'No automated verification source available for this issuer.' };
  }

  return { status: 'verification_pending', reason: `Verification through ${ISSUER_REGISTRY[issuerType]?.name || issuerType} is pending. API connection not established in prototype.` };
}

/**
 * Verify an entire document against its issuing authority.
 * @param {object} document        - DB document row
 * @param {Array}  extractedFields - extracted field objects
 * @returns {Promise<{status, source_name, source_response, verified_at}>}
 */
async function verifyDocument(document, extractedFields) {
  const docType  = document.name || '';
  const category = document.category || '';
  const issuerType = getIssuerType(docType, category);
  const issuer = ISSUER_REGISTRY[issuerType];
  const sourceName = issuer ? issuer.name : 'Manual Review';

  const expiryFields = extractedFields.filter(f =>
    /expir|valid\s*till|validity/i.test(f.fieldName || f.field_name || '')
  );

  for (const ef of expiryFields) {
    const val = ef.extractedValue || ef.extracted_value || '';
    if (isDateExpired(val)) {
      return {
        status: 'expired',
        source_name: sourceName,
        source_response: JSON.stringify({ detail: `Document contains expired date: "${val}"`, field: ef.fieldName || ef.field_name }),
        verified_at: null,
      };
    }
  }

  if (issuerType === 'manual' || !issuer) {
    return {
      status: 'manual_review_required',
      source_name: 'Manual Verification',
      source_response: JSON.stringify({ detail: 'No automated verification endpoint available for this document type. Routed for manual confirmation.' }),
      verified_at: null,
    };
  }

  if (!issuer.verifyUrl) {
    const hasVerifiableRef = extractedFields.some(f => {
      const val = (f.extractedValue || f.extracted_value || '').length > 5;
      return val;
    });

    if (hasVerifiableRef) {
      return {
        status: 'verification_pending',
        source_name: sourceName,
        source_response: JSON.stringify({ detail: `API endpoint for ${sourceName} not yet connected. Reference numbers extracted successfully. Awaiting live API integration.` }),
        verified_at: null,
      };
    }

    return {
      status: 'source_unavailable',
      source_name: sourceName,
      source_response: JSON.stringify({ detail: 'No verifiable reference number found in document. Cannot initiate automated verification.' }),
      verified_at: null,
    };
  }

  return {
    status: 'verification_pending',
    source_name: sourceName,
    source_response: null,
    verified_at: null,
  };
}

module.exports = { verifyDocument, verifyField, getIssuerType, ISSUER_REGISTRY };
