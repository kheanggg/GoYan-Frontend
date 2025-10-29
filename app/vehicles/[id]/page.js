"use client";

import { use } from 'react';
import VehicleDetailClient from '@/components/vehicles/VehicleDetailClient';
export default function ClientPage({ params }) {
    const resolvedParams = use(params); // Use the 'use' hook to unwrap the Promise
    const { id } = resolvedParams;
    // Use 'id' here
    return  <VehicleDetailClient
    vehicleId={id}
    />;
}