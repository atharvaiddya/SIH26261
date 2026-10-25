import re
from datetime import datetime


def parse_date(text: str):
    patterns = [
        r'(\d{1,2})[\/\-](\d{2})[\/\-](\d{4})',   # DD/MM/YYYY or DD-MM-YYYY
        r'(\d{4})[\/\-](\d{2})[\/\-](\d{2})',       # YYYY-MM-DD
        r'(\d{1,2})\s+(\w{3,9})\s+(\d{4})',          # D Month YYYY
    ]
    for pat in patterns:
        m = re.search(pat, text)
        if m:
            try:
                if len(m.group(3)) == 4 and m.group(1).isdigit():
                    return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
            except Exception:
                pass
    return None


def is_expired(text: str) -> bool:
    d = parse_date(text)
    return d is not None and d < datetime.now()


def find_value_after(tokens: list, pattern: re.Pattern, window: int = 3) -> dict | None:
    for i, tok in enumerate(tokens):
        if pattern.search(tok.get('text', '')):
            for j in range(i + 1, min(i + 1 + window, len(tokens))):
                val = tokens[j].get('text', '').strip()
                if val and not pattern.search(val):
                    return {'value': val, 'confidence': tokens[j].get('score', 0.9)}
    return None


def find_pattern_in_tokens(tokens: list, pattern: re.Pattern) -> dict | None:
    """Return first token text that matches `pattern`."""
    for tok in tokens:
        m = pattern.search(tok.get('text', ''))
        if m:
            return {'value': m.group(0), 'confidence': tok.get('score', 0.9)}
    return None


DOC_TYPE_PATTERNS = {
    'EOA': [r'extension of approval', r'\beoa\b'],
    'Registration Certificate': [r'registration certificate', r'tveta', r'tvet'],
    'Accreditation Certificate': [r'certificate of accreditation', r'accrediting body'],
    'Fire Safety NOC': [r'fire.*noc|noc.*fire', r'fire safety'],
    'Treasury Receipt': [r'treasury', r'challan', r'cyber receipt'],
    'Land Document': [r'land.*title|sale.*deed|land.*conversion'],
    'Faculty Roster': [r'faculty.*roster|cadre.*ratio|aadhaar.*verified'],
    'FDR Certificate': [r'fixed deposit|fdr|lien'],
    'Affiliation Certificate': [r'affiliation.*university|university.*syndicate'],
    'CPCSEA Certificate': [r'cpcsea|animal house'],
}


def classify_document(ocr_results: list) -> str:
    full = ' '.join(r.get('text', '') for r in ocr_results).lower()
    for doc_type, patterns in DOC_TYPE_PATTERNS.items():
        if any(re.search(p, full, re.I) for p in patterns):
            return doc_type
    return 'Other'


def extract_eoa_fields(tokens):
    fields = []

    perm_id = find_pattern_in_tokens(tokens, re.compile(r'1-\d{7,12}'))
    if perm_id:
        fields.append({'fieldName': 'Permanent ID', 'extractedValue': perm_id['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': perm_id['confidence'], 'clauseRef': '', 'pageNumber': 1})

    app_id = find_value_after(tokens, re.compile(r'application\s*id', re.I))
    if app_id:
        fields.append({'fieldName': 'Application ID', 'extractedValue': app_id['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': app_id['confidence'], 'clauseRef': '', 'pageNumber': 1})

    inst = find_value_after(tokens, re.compile(r'name of the institution', re.I))
    if inst:
        fields.append({'fieldName': 'Institution Name', 'extractedValue': inst['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': inst['confidence'], 'clauseRef': '', 'pageNumber': 1})

    region = find_value_after(tokens, re.compile(r'\bregion\b', re.I))
    if region:
        fields.append({'fieldName': 'Region', 'extractedValue': region['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': region['confidence'], 'clauseRef': '', 'pageNumber': 1})

    date = (find_value_after(tokens, re.compile(r'date of approval', re.I)) or
            find_pattern_in_tokens(tokens, re.compile(r'\d{2}[\/\-]\d{2}[\/\-]\d{4}')))
    if date:
        fields.append({'fieldName': 'Date of Approval', 'extractedValue': date['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': date['confidence'], 'clauseRef': 'APH Sec 1.1', 'pageNumber': 1})

    return fields


def extract_registration_fields(tokens):
    fields = []

    reg_no = find_pattern_in_tokens(tokens, re.compile(r'[A-Z]{2,}\/[A-Z]+\/[A-Z]+\/\d+\/\d+'))
    if reg_no:
        fields.append({'fieldName': 'Registration Number', 'extractedValue': reg_no['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': reg_no['confidence'], 'clauseRef': '', 'pageNumber': 1})

    expiry = (find_value_after(tokens, re.compile(r'expiry\s*date|valid\s*until|valid\s*to', re.I)) or
              find_pattern_in_tokens(tokens, re.compile(r'\d{1,2}[\/\-]\d{2}[\/\-]\d{4}')))
    if expiry:
        exp_status = 'Discrepancy' if is_expired(expiry['value']) else 'Compliant'
        fields.append({'fieldName': 'Expiry Date', 'extractedValue': expiry['value'],
                       'prescribedNorm': 'Valid on scrutiny date', 'status': exp_status,
                       'confidence': expiry['confidence'], 'clauseRef': '', 'pageNumber': 1})

    return fields


def extract_fire_noc_fields(tokens):
    fields = []

    expiry = (find_value_after(tokens, re.compile(r'valid\s*up\s*to|valid\s*till|expiry', re.I)) or
              find_pattern_in_tokens(tokens, re.compile(r'\d{1,2}[\/\-]\d{2}[\/\-]\d{4}')))
    if expiry:
        exp_status = 'Discrepancy' if is_expired(expiry['value']) else 'Compliant'
        fields.append({'fieldName': 'NOC Validity Date', 'extractedValue': expiry['value'],
                       'prescribedNorm': 'Valid on scrutiny date', 'status': exp_status,
                       'confidence': expiry['confidence'], 'clauseRef': 'APH Sec 6.1', 'pageNumber': 1})

    issuer = find_value_after(tokens, re.compile(r'issued\s*by|authority', re.I))
    if issuer:
        fields.append({'fieldName': 'Issuing Authority', 'extractedValue': issuer['value'],
                       'prescribedNorm': 'Chief Fire Officer / Competent Authority', 'status': 'Unverified',
                       'confidence': issuer['confidence'], 'clauseRef': 'APH Sec 6.1', 'pageNumber': 1})

    return fields


def extract_treasury_fields(tokens):
    fields = []

    challan = find_pattern_in_tokens(tokens, re.compile(r'[A-Z]{4,}\d{12,}'))
    if challan:
        fields.append({'fieldName': 'Challan Number (CIN)', 'extractedValue': challan['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': challan['confidence'], 'clauseRef': '', 'pageNumber': 1})

    amount = find_value_after(tokens, re.compile(r'\bamount\b', re.I))
    if amount:
        fields.append({'fieldName': 'Amount', 'extractedValue': amount['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': amount['confidence'], 'clauseRef': '', 'pageNumber': 1})

    bank = find_value_after(tokens, re.compile(r'name of bank|bank\s*name', re.I))
    if bank:
        fields.append({'fieldName': 'Bank Name', 'extractedValue': bank['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': bank['confidence'], 'clauseRef': '', 'pageNumber': 1})

    return fields


def extract_accreditation_fields(tokens):
    fields = []

    body = find_value_after(tokens, re.compile(r'accrediting\s*body', re.I))
    if body:
        fields.append({'fieldName': 'Accrediting Body', 'extractedValue': body['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': body['confidence'], 'clauseRef': '', 'pageNumber': 1})

    validity = (find_value_after(tokens, re.compile(r'certification\s*validity|valid\s*from', re.I)) or
                find_pattern_in_tokens(tokens, re.compile(r'from\s+\w+\s+\d+,\s+\d{4}', re.I)))
    if validity:
        fields.append({'fieldName': 'Certification Validity', 'extractedValue': validity['value'],
                       'prescribedNorm': 'Active on scrutiny date', 'status': 'Unverified',
                       'confidence': validity['confidence'], 'clauseRef': '', 'pageNumber': 1})

    return fields


def extract_generic_fields(tokens):
    fields = []
    date = find_pattern_in_tokens(tokens, re.compile(r'\d{1,2}[\/\-]\d{2}[\/\-]\d{4}'))
    if date:
        fields.append({'fieldName': 'Detected Date', 'extractedValue': date['value'],
                       'prescribedNorm': '', 'status': 'Unverified',
                       'confidence': date['confidence'], 'clauseRef': '', 'pageNumber': 1})
    return fields


EXTRACTORS = {
    'EOA':                     extract_eoa_fields,
    'Registration Certificate': extract_registration_fields,
    'Accreditation Certificate': extract_accreditation_fields,
    'Fire Safety NOC':          extract_fire_noc_fields,
    'Treasury Receipt':         extract_treasury_fields,
}


def extract_fields(ocr_results: list, doc_type: str) -> list:
    extractor = EXTRACTORS.get(doc_type, extract_generic_fields)
    return extractor(ocr_results)


if __name__ == '__main__':
    import sys, json
    if len(sys.argv) < 2:
        print('Usage: python field_extractor.py <ocr_json_file>')
        sys.exit(1)
    with open(sys.argv[1]) as f:
        data = json.load(f)
    doc_type = classify_document(data)
    fields = extract_fields(data, doc_type)
    print(json.dumps({'docType': doc_type, 'fields': fields}, ensure_ascii=False, indent=2))
