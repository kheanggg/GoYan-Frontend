export function normalizeVehicleType(raw) {
  if (!raw) return null;
  return {
    id: raw.vehicle_type_id,          // use the correct backend field
    name: raw.vehicle_type_name || '', // display name
    // Add more fields if your API includes them (e.g. icon, capacity)
  };
}

export function normalizeVehicleTypesList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeVehicleType);
}
