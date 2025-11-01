'use client';
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import ConfirmationButton from './ConfirmationButton';
import useVehicleDetail from '@/features/vehicles/hooks/useVehicleDetail';
import { useRouter } from 'next/navigation';
import VendorCard from './VendorCard';

export default function VehicleDetailClient({ vehicleId }) {
    const router = useRouter();
    const { vehicle, loading, error, refetch } = useVehicleDetail(vehicleId);

    if (loading) return <div className="bg-white min-h-screen flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
    if (error) return <div>Error loading vehicle</div>;
    if (!vehicle) return <div>Not found</div>;

    const handleBack = () => { window.history.back(); }

    const handleConfirmation = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

        router.push(`/confirmation/${encodeURIComponent(vehicle.id)}${qs}`);
    };

    return (
        <div className="h-screen bg-white flex flex-col items-center overflow-hidden">
            <div className="w-full text-black flex items-center justify-center relative px-4 py-5 flex-shrink-0">
                <ChevronLeft
                    onClick={handleBack}
                    className="w-6 h-6 cursor-pointer absolute left-4"
                />
                <h1 className="text-xl font-semibold">Vehicle Detail</h1>
            </div>

            <div className="max-w-sm w-full flex-shrink-0">
                <img
                    src={vehicle.media?.[0]?.url || '/images/vehicle/placeholder.jpg'}
                    alt={vehicle.name}
                    className="w-full h-60 object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/vehicle/placeholder.jpg'; }}
                />
            </div>

            <div className="w-full bg-white -mt-2 rounded-t-3xl px-4 py-4 flex flex-col items-center relative flex-1 text-black" style={{ flex: '1 1 0', minHeight: 0 }}>
                <div className="absolute top-0 left-0 w-full h-4 rounded-t-3xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.2)] pointer-events-none" />

                <div className="max-w-sm w-full flex flex-col h-full">
                    <div className="flex-shrink-0 sticky top-0 bg-white z-10 pb-3">
                        <p className="text-2xl font-semibold text-black">{vehicle?.name}</p>
                    </div>

                    <div>
                        <VendorCard name={vehicle?.shop.name}/>
                    </div>

                    <div className="mt-2 w-full overflow-y-scroll flex-1 pr-2 pb-20 no-scrollbar" style={{ minHeight: 0 }}>
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Includes</h2>
                            <ul className="mt-1 list-disc list-inside text-sm text-gray-500">
                                <li>Helmet Included</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Requirements</h2>
                            <ul className="mt-1 list-disc list-inside text-sm text-gray-500">
                                <li>Non-Khmer Passport</li>
                                <li>Khmer Original ID Card or Passport</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Terms & Conditions</h2>
                            <ul className="mt-1 list-disc list-inside text-sm text-gray-500 space-y-1">
                                <li>The bike must be used responsibly and returned in the same condition.</li>
                                <li>Any damage, loss, or fines during your booking period are your responsibility.</li>
                                <li>By placing a booking, you agree to these Terms & Conditions.</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Merchant Locations</h2>
                            <div className="w-full h-48 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                <img src="/images/map.png" alt="Merchant Location Map" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-4 w-full max-w-sm">
                    <ConfirmationButton price={vehicle?.rental_price_per_day} onClick={handleConfirmation} />
                </div>
            </div>
        </div>
    );
}
