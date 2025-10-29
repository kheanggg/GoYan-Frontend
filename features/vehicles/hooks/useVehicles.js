// features/vehicles/hooks/useVehicles.js
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchVehicles } from '../api/vehicles';

/**
 * useVehicles hook
 * @param {Object} initialParams initial query params { location, start, end, type, q, page, per_page }
 * @param {Object} options { immediate: true|false }
 * @returns { data, meta, loading, error, refetch, setParams }
 */
export function useVehicles(initialParams = {}, options = { immediate: true }) {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(Boolean(options.immediate));
  const [error, setError] = useState(null);

  // store current abort controller so we can cancel previous request
  const controllerRef = useRef(null);

  const load = useCallback(async (overrideParams = null) => {
    const p = overrideParams ? { ...overrideParams } : { ...params };

    // cancel previous
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch (e) { /* ignore */ }
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // axios supports fetch-style signal
      const res = await fetchVehicles(p, { signal: controller.signal });
      // res is the API envelope, normalize:
      const items = Array.isArray(res.data) ? res.data : (res.items || []);
      setData(items);
      setMeta(res.meta || null);
      setLoading(false);
      return res;
    } catch (err) {
      if (err?.name === 'AbortError') {
        // request canceled
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
    // cleanup: abort when unmount
    return () => {
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) {}
      }
    };
  }, []); // eslint-disable-line

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
