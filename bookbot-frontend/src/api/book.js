import { get, put } from './apiClient';

export async function fetchBook(id) {
  return get(`/api/books/${id}.json`);
}

export async function updateBook(id, payload) {
  return put(`/api/books/${id}.json`, { book: payload });
}
