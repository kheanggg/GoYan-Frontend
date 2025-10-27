import { apiClient } from '@/lib/api';

export async function getAllVehicleTypes() {
  const res = await apiClient.get('/vehicletypes');
  return res.data.data;
}