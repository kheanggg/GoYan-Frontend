import { apiClient } from '@/lib/api';

export async function getAllLocations() {
  const res = await apiClient.get('/locations');
  return res.data.data;
}