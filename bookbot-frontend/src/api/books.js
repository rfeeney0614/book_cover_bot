import { get, post } from './apiClient';

export async function fetchBooks({ page = 1, search = '' } = {}) {
  const params = {};
  if (page) params.page = page;
  if (search) params.search = search;
  return get('/api/books.json', params);
}

export async function fetchBook(id) {
  return get(`/api/books/${id}.json`);
}

export async function createBook(book) {
  return post('/api/books.json', { book });
}

export async function updateBook(id, book) {
  const { put } = await import('./apiClient');
  return put(`/api/books/${id}.json`, { book });
}

export async function deleteBook(id) {
  const { del } = await import('./apiClient');
  return del(`/api/books/${id}.json`);
}
