export async function fetchFormats(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `/api/formats.json${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch formats (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchFormat(id) {
  const res = await fetch(`/api/formats/${id}.json`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch format (${res.status}): ${text}`);
  }
  return res.json();
}

export async function createFormat(payload) {
  const res = await fetch(`/api/formats.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ format: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create format (${res.status}): ${text}`);
  }
  return res.json();
}

export async function updateFormat(id, payload) {
  const res = await fetch(`/api/formats/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ format: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update format (${res.status}): ${text}`);
  }
  return res.json();
}

export async function deleteFormat(id) {
  const res = await fetch(`/api/formats/${id}.json`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete format (${res.status}): ${text}`);
  }
  return true;
}
