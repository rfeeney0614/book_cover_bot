import { get, patch } from './apiClient';

export async function fetchPrintQueue(sortBy = 'date_added') {
  return get(`/api/print_queue?sort_by=${sortBy}`);
}

export async function incrementJobOrder(jobOrderId) {
  return patch(`/api/job_orders/${jobOrderId}/increment`);
}

export async function decrementJobOrder(jobOrderId) {
  return patch(`/api/job_orders/${jobOrderId}/decrement`);
}
