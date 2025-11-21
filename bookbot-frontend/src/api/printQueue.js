import { API_BASE_URL } from '../config';

const API_BASE = `${API_BASE_URL}/api`;

export async function fetchPrintQueue() {
  const response = await fetch(`${API_BASE}/print_queue`);
  if (!response.ok) throw new Error('Failed to fetch print queue');
  return response.json();
}

export async function incrementJobOrder(jobOrderId) {
  const response = await fetch(`${API_BASE}/job_orders/${jobOrderId}/increment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to increment quantity');
  return response.json();
}

export async function decrementJobOrder(jobOrderId) {
  const response = await fetch(`${API_BASE}/job_orders/${jobOrderId}/decrement`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to decrement quantity');
  return response.json();
}
