"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import SearchBar from '@/components/vehicles/Searchbar';
import VehicleCard from '@/components/vehicles/VehicleCard';
import useVehicles from '@/features/vehicles/hooks/useVehicles';

export default function VehicleListClient() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  const location = searchParams.get('location') || 'phnom_penh';
  const start = searchParams.get('start') || '2025-11-01';
  const end = searchParams.get('end') || '2025-11-07';
  const type = searchParams.get('type') || 'bicycle';

  const { data, loading, error } = useVehicles({
    location,
    start,
    end,
    type,
    per_page: 10,
  });

  const formattedDate =
    start && end
      ? new Date(start).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : 'Unknown Dates';

  const onBack = () => window.history.back();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* Header */}
      <div className="w-full bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="w-full py-5 flex items-center space-x-4 mx-4">
          <button onClick={onBack} aria-label="Back" className="flex items-center">
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
          </button>
          <div className="flex flex-col">
            <p className="text-xl font-semibold capitalize">{location.replace('_', ' ')}</p>
            <p className="text-xs">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 lg:max-w-sm w-full">
        <div className="w-full mt-4">
          <SearchBar value={query} onChange={setQuery} placeholder="Search vehicles, brand or shop" />
        </div>

        {/* Data Section */}
        <div className="w-full mt-4 space-y-4">
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          {error && <div className="text-center text-red-500">Failed to load vehicles</div>}

          {!loading && !error && data?.length > 0 ? (
            data
              .filter(v => (v.vehicle_name || v.name || '').toLowerCase().includes(query.toLowerCase()))
              .map(v => <VehicleCard key={v.vehicle_id || v.id} vehicle={v} />)
          ) : (
            !loading && !error && <div className="text-center text-gray-500">No vehicles found</div>
          )}
        </div>
      </div>
    </div>
  );
}
