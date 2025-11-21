import { API_BASE_URL } from '../config';

export async function fetchBook(id) {
  const res = await fetch(`${API_BASE_URL}/api/books/${id}.json`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch book (${res.status}): ${text}`);
  }
  return res.json();
}

export async function updateBook(id, payload) {
  const res = await fetch(`${API_BASE_URL}/api/books/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ book: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update book (${res.status}): ${text}`);
  }
  return res.json();
}
