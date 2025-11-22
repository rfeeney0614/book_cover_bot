import { get, patch } from './apiClient';

export async function fetchPrintQueue() {
  return get('/api/print_queue');
}

export async function incrementJobOrder(jobOrderId) {
  return patch(`/api/job_orders/${jobOrderId}/increment`);
}

export async function decrementJobOrder(jobOrderId) {
  return patch(`/api/job_orders/${jobOrderId}/decrement`);
}
