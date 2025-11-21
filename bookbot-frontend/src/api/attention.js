import { API_BASE_URL } from '../config';

export async function fetchAttentionItems(page = 1, perPage = 20, filterType = 'all') {
  const params = new URLSearchParams({ 
    page: page.toString(), 
    per_page: perPage.toString() 
  });
  
  if (filterType && filterType !== 'all') {
    params.append('type', filterType);
  }
  
  const res = await fetch(`${API_BASE_URL}/api/attention.json?${params}`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch attention items (${res.status}): ${text}`);
  }
  return res.json();
}
