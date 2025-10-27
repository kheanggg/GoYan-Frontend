export function normalizeVehicleType(raw) {
  if (!raw) return null;
  return {
    id: raw.vehicle_type_id,
    name: raw.vehicle_type_name || '',
  };
}

export function normalizeVehicleTypesList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeVehicleType);
}
