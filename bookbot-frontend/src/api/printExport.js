import { post, get } from './apiClient';
import { API_BASE_URL } from '../config';

export async function triggerExport() {
  return post('/api/print_exports/export');
}

export async function checkExportStatus(exportId) {
  return get(`/api/print_exports/${exportId}/status`);
}

export function getDownloadUrl(exportId) {
  return `${API_BASE_URL}/api/print_exports/${exportId}/download`;
}
