"use client";

import { useEffect, useState } from 'react';
import { getAllVehicleTypes } from '@/features/onboarding/api/vehicleType';
import { normalizeVehicleTypesList } from '@/models/vehicleType';

export default function useLocations({ autoLoad = true } = {}) {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(Boolean(autoLoad));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!autoLoad) return;
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const raw = await getAllVehicleTypes();
                if (!mounted) return;
                setVehicleTypes(normalizeVehicleTypesList(raw));
            } catch (err) {
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [autoLoad]);

    // expose refresh so UI can re-fetch
    async function refresh() {
        setLoading(true);
        setError(null);
        try {
            const raw = await getAllVehicleTypes();
            setVehicleTypes(normalizeVehicleTypesList(raw));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return { vehicleTypes, loading, error, refresh };
}
