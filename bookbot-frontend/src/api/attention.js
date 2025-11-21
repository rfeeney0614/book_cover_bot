import { API_BASE_URL } from '../config';

export async function fetchAttentionItems() {
  const res = await fetch(`${API_BASE_URL}/api/attention.json`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch attention items (${res.status}): ${text}`);
  }
  return res.json();
}
