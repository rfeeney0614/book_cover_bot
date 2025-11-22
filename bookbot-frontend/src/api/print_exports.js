import { get, post, del } from './apiClient';
import { API_BASE_URL } from '../config';

export async function fetchPrintExports(params = {}) {
  return get('/api/print_exports.json', params);
}

export async function fetchPrintExport(id) {
  return get(`/api/print_exports/${id}.json`);
}

export async function createPrintExport(payload) {
  return post('/api/print_exports.json', { print_export: payload });
}

export async function deletePrintExport(id) {
  return del(`/api/print_exports/${id}.json`);
}

export async function printExportStatus(id) {
  return get(`/api/print_exports/${id}/status.json`);
}

export function printExportDownload(id) {
  // Trigger browser navigation to the download endpoint. In Docker/dev this will proxy to Rails API.
  const url = `${API_BASE_URL}/api/print_exports/${id}/download`;
  // Open in same window to trigger inline download; caller can use window.open if needed.
  window.location.assign(url);
}
