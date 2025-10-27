export function normalizeLocation(raw) {
  if (!raw) return null;
  return {
    id: raw.location_id,
    name: raw.location_name || '',
  };
}

export function normalizeLocationsList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeLocation);
}