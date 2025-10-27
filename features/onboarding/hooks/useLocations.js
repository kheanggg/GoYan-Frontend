"use client";

import { useEffect, useState } from 'react';
import { getAllLocations } from '@/features/onboarding/api/location';
import { normalizeLocationsList } from '@/models/location';

export default function useLocations({ autoLoad = true } = {}) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(Boolean(autoLoad));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!autoLoad) return;
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const raw = await getAllLocations();
                if (!mounted) return;
                setLocations(normalizeLocationsList(raw));
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
            const raw = await getAllLocations();
            setLocations(normalizeLocationsList(raw));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return { locations, loading, error, refresh };
}
