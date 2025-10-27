import { apiClient } from '@/lib/api';

export async function getAllVehicleTypes() {
  // returns array of raw location objects from backend
  return apiClient('/api/vehicletypes', { method: 'GET' });
}