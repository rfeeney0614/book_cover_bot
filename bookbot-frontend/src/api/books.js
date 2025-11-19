export async function fetchBooks() {
  const res = await fetch('/api/books.json', {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch books (${res.status}): ${text}`);
  }
  const data = await res.json();
  // If Rails responds with an object wrapper, try to normalize to an array
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.books)) return data.books;
  return data;
}
