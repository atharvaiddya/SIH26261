/**
 * AICTE Setu — API Client
 * Thin fetch wrapper connecting the React frontend to the Express backend.
 * Falls back silently — callers should handle thrown errors.
 */

const API_BASE = 'http://localhost:3000/api';

// ─── Applications ─────────────────────────────────────────────────────────────

export async function fetchApplications(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/applications`);
  if (!res.ok) throw new Error(`fetchApplications: ${res.status}`);
  return res.json();
}

export async function fetchApplication(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/applications/${id}`);
  if (!res.ok) throw new Error(`fetchApplication: ${res.status}`);
  return res.json();
}

export async function updateApplicationStatus(
  appId: string,
  status: string,
  notes: string,
  officerName: string,
  officerRole: string,
): Promise<void> {
  await fetch(`${API_BASE}/applications/${appId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes, officerName, officerRole }),
  });
}

// ─── Anomalies ────────────────────────────────────────────────────────────────

export async function fetchAnomalies(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/anomalies`);
  if (!res.ok) throw new Error(`fetchAnomalies: ${res.status}`);
  return res.json();
}

export async function resolveAnomaly(
  anomalyId: string,
  status: string,
  actionTaken?: string,
): Promise<void> {
  await fetch(`${API_BASE}/anomalies/${anomalyId}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, actionTaken }),
  });
}

// ─── Compliance Rules ─────────────────────────────────────────────────────────

export async function fetchRules(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/compliance/rules`);
  if (!res.ok) throw new Error(`fetchRules: ${res.status}`);
  return res.json();
}

export async function toggleRule(ruleId: string): Promise<void> {
  await fetch(`${API_BASE}/compliance/rules/${ruleId}/toggle`, {
    method: 'PUT',
  });
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export async function fetchAuditLogs(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/audit`);
  if (!res.ok) throw new Error(`fetchAuditLogs: ${res.status}`);
  return res.json();
}

// ─── Documents ────────────────────────────────────────────────────────────────

export async function uploadDocument(
  file: File,
  applicationId: string,
  category: string,
): Promise<any> {
  const form = new FormData();
  form.append('document', file);
  form.append('applicationId', applicationId);
  form.append('category', category);
  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`uploadDocument: ${res.status}`);
  return res.json();
}

export async function verifyDocument(documentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/documents/${documentId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`verifyDocument: ${res.status}`);
  return res.json();
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<any> {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error(`fetchDashboardStats: ${res.status}`);
  return res.json();
}
