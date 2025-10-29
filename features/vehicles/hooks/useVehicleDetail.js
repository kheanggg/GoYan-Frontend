// features/vehicles/hooks/useVehicleDetail.js
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchVehicleById } from '../api/vehicle';

/**
 * useVehicleDetail - fetch a single vehicle by ID
 * @param {string} vehicleId
 * @param {Object} options - { immediate: true }
 */
export function useVehicleDetail(vehicleId, options = { immediate: true }) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(Boolean(options.immediate));
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const load = useCallback(async (id = vehicleId) => {
    if (!id) return;

    // Abort previous request
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch (e) {}
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching vehicle ID:', id); // Debug log
      const res = await fetchVehicleById(id);
      const data = res?.data ?? res ?? null;

      setVehicle(data);
      setLoading(false);
      return data;
    } catch (err) {
      const isAbort =
        err?.name === 'AbortError' ||
        err?.name === 'CanceledError' ||
        err?.__CANCEL__ === true ||
        (err?.message && err.message.toLowerCase().includes('canceled'));

      if (isAbort) return;

      setError(err);
      setLoading(false);
      return Promise.reject(err);
    }
  }, [vehicleId]);

  // Trigger fetch only if vehicleId exists
  useEffect(() => {
    if (options.immediate && vehicleId) {
      load();
    }

    return () => {
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) {}
      }
    };
  }, [vehicleId, load, options.immediate]);

  const refetch = useCallback(() => {
    if (vehicleId) load();
  }, [load, vehicleId]);

  return {
    vehicle,
    loading,
    error,
    refetch,
  };
}

export default useVehicleDetail;
