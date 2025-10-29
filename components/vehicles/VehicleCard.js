'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Props:
 *  - vehicle: object (may be raw or normalized)
 *  - onSelect?: function(vehicle) optional callback
 */
export default function VehicleCard({ vehicle = {}, onSelect }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Support both shapes: normalized or raw
  const raw = vehicle ?? '';

  // Id/identity
  const id = raw?.id ?? vehicle?.id ?? raw?.vehicle_id ?? 'unknown-id';

  // Name resolution
  const brand = raw?.brand ?? '';
  const model = raw?.model ?? '';
  const name = raw?.name ?? (`${brand} ${model}`.trim() || 'Untitled vehicle');

  // Location resolution (many possible shapes from different APIs)
  const location =
    raw?.shop.name ?? '';

  // Price resolution
  const rawPriceCandidates = [
    raw?.rental_price_per_day
  ];
  let rawPrice = rawPriceCandidates.find(x => typeof x === 'number' && Number.isFinite(x));
  if (rawPrice === undefined) rawPrice = 0;
  const price = Number.isFinite(Number(rawPrice)) ? Number(rawPrice) : 0;
  // nice formatting
  const priceDisplay = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(price);

  // Image resolution (backend may return full url or relative path)
  const image =
    raw?.media?.[0]?.url ?? '/images/vehicle/placeholder.jpg';

  const qs = searchParams?.toString() ? `?${searchParams.toString()}` : '';

  const handleClick = (e) => {
    if (onSelect && typeof onSelect === 'function') {
      onSelect(vehicle);
      return;
    }
    // default navigation to vehicle detail, preserving querystring
    router.push(`/vehicles/${encodeURIComponent(id)}${qs}`);
  };

  // safe image error handler
  const handleImgError = (e) => {
    // prevent infinite loop
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/images/vehicles/placeholder.png';
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      className="w-full h-40 bg-white rounded-xl shadow-md p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transform hover:scale-[1.01] transition-transform duration-200"
    >
      <div className="flex flex-col justify-between h-full flex-1 mr-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        <p className="text-left text-gray-500">
          <span className="text-sm">from </span>
          <span className="font-bold text-black ml-1">{priceDisplay}/day</span>
        </p>
      </div>

      <div className="w-36 h-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={image}
          alt={name}
          onError={handleImgError}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
