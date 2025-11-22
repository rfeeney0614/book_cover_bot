import { post, get } from './apiClient';
import { API_BASE_URL } from '../config';

const API_BASE = `${API_BASE_URL}/api`;

export async function triggerExport() {
  return post('/api/print_exports/export');
}

export async function checkExportStatus(exportId) {
  return get(`/api/print_exports/${exportId}/status`);
}

export function getDownloadUrl(exportId) {
  return `${API_BASE}/print_exports/${exportId}/download`;
}
