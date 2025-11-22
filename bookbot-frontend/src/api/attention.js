import { get } from './apiClient';

export async function fetchAttentionItems(page = 1, perPage = 20, filterType = 'all') {
  const params = { 
    page: page.toString(), 
    per_page: perPage.toString() 
  };
  
  if (filterType && filterType !== 'all') {
    params.type = filterType;
  }
  
  return get('/api/attention.json', params);
}
