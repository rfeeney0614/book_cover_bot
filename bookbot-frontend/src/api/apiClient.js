import { API_BASE_URL } from '../config';

/**
 * Generic API request handler with consistent error handling
 */
async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  // Return true for DELETE requests with no content
  if (res.status === 204 || options.method === 'DELETE') {
    return true;
  }
  return res.json();
}

/**
 * Build query string from params object
 */
function buildQueryString(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
}

/**
 * Perform GET request
 */
export async function get(endpoint, params = {}) {
  const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;
  return apiRequest(url, {
    headers: { Accept: 'application/json' }
  });
}

/**
 * Perform POST request
 */
export async function post(endpoint, data) {
  const url = `${API_BASE_URL}${endpoint}`;
  return apiRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Perform PUT request
 */
export async function put(endpoint, data) {
  const url = `${API_BASE_URL}${endpoint}`;
  return apiRequest(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Perform PATCH request
 */
export async function patch(endpoint, body = null, contentType = 'application/json') {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = contentType === 'application/json' 
    ? { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    : {};
  
  const options = {
    method: 'PATCH',
    headers,
  };

  if (body !== null) {
    options.body = contentType === 'application/json' ? JSON.stringify(body) : body;
  }

  return apiRequest(url, options);
}

/**
 * Perform DELETE request
 */
export async function del(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  return apiRequest(url, {
    method: 'DELETE'
  });
}
