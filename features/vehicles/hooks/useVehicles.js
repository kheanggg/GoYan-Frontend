// features/vehicles/hooks/useVehicles.js
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchVehicles } from '../api/vehicle';

/**
 * useVehicles
 * @param {Object} initialParams - initial query params { location, start, end, type, q, page, per_page }
 * @param {Object} options - { immediate: true, auto: true }
 *    - immediate: run initial load on mount
 *    - auto: refetch automatically when params change
 */
export function useVehicles(initialParams = {}, options = { immediate: true, auto: true }) {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(Boolean(options.immediate));
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const load = useCallback(async (overrideParams = null) => {
    const p = overrideParams ? { ...overrideParams } : { ...params };

    // abort previous request
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch (e) { /* ignore */ }
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // If your fetchVehicles supports passing signal, update its signature and forward it.
      // For now we call fetchVehicles(p) and expect it to return an axios-like response or API envelope.
      const res = await fetchVehicles(p);

      // Normalize envelope:
      // - If fetchVehicles already returned the envelope (res), use that
      // - If fetchVehicles returned axios response (res.data), use res.data
      const envelope = res && res.data ? res.data : res;

      // Determine items array
      const items = Array.isArray(envelope?.data)
        ? envelope.data
        : Array.isArray(envelope?.items)
        ? envelope.items
        : Array.isArray(envelope)
        ? envelope
        : [];

      setData(items);
      setMeta(envelope?.meta ?? null);
      setLoading(false);

      return envelope;
    } catch (err) {
      // axios Abort/Canceled errors vary by version/name
      const isAbort =
        err?.name === 'AbortError' ||
        err?.name === 'CanceledError' ||
        err?.__CANCEL__ === true ||
        (err?.message && err.message.toLowerCase().includes('canceled'));

      if (isAbort) {
        // cancelled - don't set global error
        return;
      }

      setError(err);
      setLoading(false);
      return Promise.reject(err);
    }
  }, [params]);

  // initial load if immediate
  useEffect(() => {
    if (options.immediate) {
      load();
    }
    return () => {
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) {}
      }
    };
  // intentionally include load in deps so cleanup and recreate happen correctly
  }, [load, options.immediate]);

  // auto-refetch when params change (if enabled)
  useEffect(() => {
    if (!options.auto) return;
    // skip initial fetch if immediate happened (load() was already called on mount)
    // but it's okay to call load() again; dedupe if needed
    load();
  }, [JSON.stringify(params)]); // stringify so deep equality triggers reload when params change

  const refetch = useCallback(() => load(), [load]);

  return {
    data,
    meta,
    loading,
    error,
    params,
    setParams,
    refetch,
  };
}

export default useVehicles;