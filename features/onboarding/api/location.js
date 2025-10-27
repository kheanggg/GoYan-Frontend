import { apiClient } from '@/lib/api';

export async function getAllLocations() {
  // returns array of raw location objects from backend
  return apiClient('/api/locations', { method: 'GET' });
}