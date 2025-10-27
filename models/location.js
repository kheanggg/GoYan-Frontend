export function normalizeLocation(raw) {
  if (!raw) return null;
  return {
    id: raw.location_id,            // keep original id (string slug)
    name: raw.location_name || '',  // user display name
    // add derived fields if needed
  };
}

export function normalizeLocationsList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeLocation);
}