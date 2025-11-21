import { API_BASE_URL } from '../config';

export async function fetchPrintExports(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/print_exports.json${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch print exports (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchPrintExport(id) {
  const res = await fetch(`${API_BASE_URL}/api/print_exports/${id}.json`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch print export (${res.status}): ${text}`);
  }
  return res.json();
}

export async function createPrintExport(payload) {
  const res = await fetch(`${API_BASE_URL}/api/print_exports.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ print_export: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create print export (${res.status}): ${text}`);
  }
  return res.json();
}

export async function deletePrintExport(id) {
  const res = await fetch(`${API_BASE_URL}/api/print_exports/${id}.json`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete print export (${res.status}): ${text}`);
  }
  return true;
}

export async function printExportStatus(id) {
  const res = await fetch(`${API_BASE_URL}/api/print_exports/${id}/status.json`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch export status (${res.status}): ${text}`);
  }
  return res.json();
}

export function printExportDownload(id) {
  // Trigger browser navigation to the download endpoint. In Docker/dev this will proxy to Rails API.
  const url = `${API_BASE_URL}/api/print_exports/${id}/download`;
  // Open in same window to trigger inline download; caller can use window.open if needed.
  window.location.assign(url);
}
