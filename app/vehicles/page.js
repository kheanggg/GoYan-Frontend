// app/vehicles/page.jsx  (server component)
import React, { Suspense } from 'react';
import VehicleListClient from '@/components/vehicles/VehicleListPageClient';

export const dynamic = 'force-static'; // optional: remove if you prefer prerendering normally

export default function VehiclesPage({ searchParams }) {
  // Wrap the client component in Suspense so Next can prerender safely
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <VehicleListClient serverSearchParams={searchParams} />
    </Suspense>
  );
}