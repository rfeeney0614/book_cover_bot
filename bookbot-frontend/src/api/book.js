import { get, put, del } from './apiClient';

export async function fetchBook(id) {
  return get(`/api/books/${id}.json`);
}

export async function updateBook(id, payload) {
  return put(`/api/books/${id}.json`, { book: payload });
}

export async function deleteBook(id) {
  return del(`/api/books/${id}.json`);
}
