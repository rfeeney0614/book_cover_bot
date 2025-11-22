import { get, post, del } from './apiClient';

export async function fetchJobOrders(params = {}) {
  return get('/api/job_orders.json', params);
}

export async function fetchJobOrder(id) {
  return get(`/api/job_orders/${id}.json`);
}

export async function createJobOrder(payload) {
  return post('/api/job_orders.json', { job_order: payload });
}

export async function deleteJobOrder(id) {
  return del(`/api/job_orders/${id}.json`);
}
