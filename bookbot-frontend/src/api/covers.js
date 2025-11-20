export async function fetchCovers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `/api/covers.json${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch covers (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchCoversForBook(bookId) {
  // Assumes API supports /api/books/:id/covers.json or /api/covers.json?book_id=:id
  const url = `/api/covers.json?book_id=${encodeURIComponent(bookId)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch covers for book (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchCover(id) {
  const res = await fetch(`/api/covers/${id}.json`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch cover (${res.status}): ${text}`);
  }
  return res.json();
}

export async function createCover(payload) {
  const res = await fetch(`/api/covers.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ cover: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create cover (${res.status}): ${text}`);
  }
  return res.json();
}

export async function updateCover(id, payload) {
  const res = await fetch(`/api/covers/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ cover: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update cover (${res.status}): ${text}`);
  }
  return res.json();
}

export async function deleteCover(id) {
  const res = await fetch(`/api/covers/${id}.json`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete cover (${res.status}): ${text}`);
  }
  return true;
}
