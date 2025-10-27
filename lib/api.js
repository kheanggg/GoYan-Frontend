const BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiClient(endpoint, options = {}) {
  const url = BASE + endpoint;
  const config = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  };

  const res = await fetch(url, config);
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (e) { /* invalid json */ }

  if (!res.ok) {
    const message = (json && json.errors?.message) || text || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  // If your API wraps responses like { success, data, meta, errors }
  if (json && json.success === false) {
    const err = new Error(json.errors?.message || 'API returned success=false');
    err.body = json;
    throw err;
  }

  // Return the useful payload (data) where possible
  return (json && (json.data ?? json)) ?? null;
}
