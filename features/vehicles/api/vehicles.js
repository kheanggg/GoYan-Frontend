// features/vehicles/api/vehicle.js
import { apiClient } from '@/lib/api';

/**
 * Build query string from params object
 * @param {Object} params - e.g. { location, start, end, type, q, page, per_page }
 * @returns {string} query string (without leading ?)
 */
function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    q.append(k, v);
  });
  return q.toString();
}

export async function fetchVehicles(params = {}) {
  // params => { location, start, end, type, q, page, per_page }
  const qs = buildQuery(params);
  const url = qs ? `/vehicles?${qs}` : '/vehicles';
  const res = await apiClient.get(url);
  return res.data; // API envelope { success, data, meta, links, errors }
}

export async function fetchVehicle(vehicleId, params = {}) {
  // If your API exposes /vehicles/:id
  // otherwise it can be /vehicles?vehicle_id=veh_001
  if (!vehicleId) throw new Error('vehicleId is required');
  const qs = buildQuery(params);
  const url = `/vehicles/${encodeURIComponent(vehicleId)}${qs ? `?${qs}` : ''}`;
  const res = await apiClient.get(url);
  return res.data;
}

/**
 * Example convenience functions:
 */
export async function searchVehicles(q, extra = {}) {
  return fetchVehicles({ q, ...extra });
}

export default {
  fetchVehicles,
  fetchVehicle,
  searchVehicles,
};
