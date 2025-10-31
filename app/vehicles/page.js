// app/vehicles/page.jsx  (server component)
import React, { Suspense } from 'react';
import VehicleListClient from '@/components/vehicles/VehicleListPageClient';

export const dynamic = 'force-static'; // optional: remove if you prefer prerendering normally

export default function VehiclesPage({ searchParams }) {
  // Wrap the client component in Suspense so Next can prerender safely
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="px-3 w-full max-w-sm space-y-5">
          <div className="flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>}>
      <VehicleListClient serverSearchParams={searchParams} />
    </Suspense>
  );
}