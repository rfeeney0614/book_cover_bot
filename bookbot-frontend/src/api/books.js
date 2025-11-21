import { API_BASE_URL } from '../config';

export async function fetchBooks({ page = 1, search = '' } = {}) {
  const qs = new URLSearchParams();
  if (page) qs.set('page', page);
  if (search) qs.set('search', search);
  const url = `${API_BASE_URL}/api/books.json${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch books (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchBook(id) {
  const res = await fetch(`${API_BASE_URL}/api/books/${id}.json`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch book (${res.status}): ${text}`);
  }
  return res.json();
}

export async function createBook(book) {
  const res = await fetch(`${API_BASE_URL}/api/books.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ book }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create book (${res.status}): ${text}`);
  }
  return res.json();
}
