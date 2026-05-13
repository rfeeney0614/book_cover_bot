import { get, post, put, del } from './apiClient';
import { API_BASE_URL } from '../config';

export async function fetchBook(id) {
  return get(`/api/books/${id}.json`);
}

export async function updateBook(id, payload) {
  return put(`/api/books/${id}.json`, { book: payload });
}

export async function deleteBook(id) {
  return del(`/api/books/${id}.json`);
}

export async function uploadSupplementaryFile(bookId, file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/upload_supplementary_file`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Upload failed (${response.status}): ${text}`);
  }
  
  return response.json();
}

export async function deleteSupplementaryFile(bookId, fileId) {
  return del(`/api/books/${bookId}/delete_supplementary_file/${fileId}`);
}

export async function downloadSupplementaryFile(bookId, fileId) {
  // Return the download URL - the browser will handle the download
  return `${API_BASE_URL}/api/books/${bookId}/download_supplementary_file/${fileId}`;
}
