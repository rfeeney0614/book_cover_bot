import { API_BASE_URL } from '../config';

export async function fetchJobOrders(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/job_orders.json${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch job orders (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchJobOrder(id) {
  const res = await fetch(`${API_BASE_URL}/api/job_orders/${id}.json`, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch job order (${res.status}): ${text}`);
  }
  return res.json();
}

export async function createJobOrder(payload) {
  const res = await fetch(`${API_BASE_URL}/api/job_orders.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ job_order: payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create job order (${res.status}): ${text}`);
  }
  return res.json();
}

export async function deleteJobOrder(id) {
  const res = await fetch(`${API_BASE_URL}/api/job_orders/${id}.json`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete job order (${res.status}): ${text}`);
  }
  return true;
}
