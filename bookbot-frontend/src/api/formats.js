import { get, post, put, del } from './apiClient';

export async function fetchFormats(params = {}) {
  return get('/api/formats.json', params);
}

export async function fetchFormat(id) {
  return get(`/api/formats/${id}.json`);
}

export async function createFormat(payload) {
  return post('/api/formats.json', { format: payload });
}

export async function updateFormat(id, payload) {
  return put(`/api/formats/${id}.json`, {
    format: {
      name: payload.name,
      height: payload.height,
      default: payload.default
    },
    construction_mappings: payload.construction_mappings || []
  });
}

export async function deleteFormat(id) {
  return del(`/api/formats/${id}.json`);
}
