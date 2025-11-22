import { get, post, put, patch, del } from './apiClient';

export async function fetchCovers(params = {}) {
  return get('/api/covers.json', params);
}

export async function fetchCoversForBook(bookId) {
  return get('/api/covers.json', { book_id: bookId });
}

export async function fetchCover(id) {
  return get(`/api/covers/${id}.json`);
}

export async function createCover(payload) {
  return post('/api/covers.json', { cover: payload });
}

export async function updateCover(id, payload) {
  return put(`/api/covers/${id}.json`, { cover: payload });
}

export async function deleteCover(id) {
  return del(`/api/covers/${id}.json`);
}

export async function uploadCoverImage(id, file) {
  const formData = new FormData();
  formData.append('cover[image]', file);
  return patch(`/api/covers/${id}.json`, formData, 'multipart/form-data');
}
