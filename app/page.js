"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const WebApp = dynamic(() => import("@twa-dev/sdk"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // wait for client-side hydration
  }, []);

  useEffect(() => {
    if (!mounted) return;
    import("@twa-dev/sdk").then((mod) => {
      const WebApp = mod.default;
      WebApp.ready();
      const tgId = WebApp.initDataUnsafe?.user?.id;

      // safe redirect only on client
      if (!tgId) return;
      router.push(`/payment-option?tgId=${tgId}`);
    });
  }, [mounted]);

  if (!mounted) return null; // prevent SSR redirect

  return <h1>Welcome to GoYan</h1>;
}
