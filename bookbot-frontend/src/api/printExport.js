const API_BASE = '/api';

export async function triggerExport() {
  const response = await fetch(`${API_BASE}/print_exports/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to trigger export');
  return response.json();
}

export async function checkExportStatus(exportId) {
  const response = await fetch(`${API_BASE}/print_exports/${exportId}/status`);
  if (!response.ok) throw new Error('Failed to check export status');
  return response.json();
}

export function getDownloadUrl(exportId) {
  return `${API_BASE}/print_exports/${exportId}/download`;
}
