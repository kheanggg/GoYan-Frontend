import { useState, useEffect, useRef } from "react";
import { getUserByTelegramId } from "../api/user";

export default function useUser(telegramId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(telegramId));
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!telegramId) {
      setUser(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const fetched = await getUserByTelegramId(telegramId);
        if (!isMounted || requestIdRef.current !== currentRequestId) return;

        if (fetched) {
          setUser(fetched);
        } else {
          setError(new Error("User not found"));
        }
      } catch (err) {
        console.error("[useUser] fetch failed:", err);
        if (!isMounted || requestIdRef.current !== currentRequestId) return;
        setError(err);
      } finally {
        if (!isMounted || requestIdRef.current !== currentRequestId) return;
        setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [telegramId]);

  return { user, loading, error };
}
