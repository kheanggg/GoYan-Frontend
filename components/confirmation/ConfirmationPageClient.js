'use client';

import { ChevronLeft } from "lucide-react";
import useVehicleDetail from '@/features/vehicles/hooks/useVehicleDetail';
import useUser from "@/features/booking/hooks/useUser";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '@/components/core/Button';
import dynamic from "next/dynamic";

const WebApp = dynamic(() => import("@twa-dev/sdk"), { ssr: false });

export default function ConfirmationPageClient({ vehicleId }) {
    const router = useRouter();
    const [telegramId, setTelegramId] = useState(null);
    const fallbackTelegramId = process.env.NEXT_PUBLIC_FALLBACK_TELEGRAM_ID;

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("@twa-dev/sdk").then((mod) => {
            const WebApp = mod.default;
            WebApp.ready();
            const id = WebApp.initDataUnsafe?.user?.id;
            setTelegramId(id ?? fallbackTelegramId);
            });
        }
    }, []);

    // Always call hooks in the same order
    const { user, loading: loadingUser, error: userError } = useUser(telegramId, { autoLoad: !!telegramId });
    const { vehicle, loading: loadingVehicle, error: vehicleError } = useVehicleDetail(vehicleId);

    const [agreed, setAgreed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [coupon, setCoupon] = useState('');

    const searchParams = useSearchParams();
    const rentDate = searchParams.get('start') || 'N/A';
    const formattedDate = rentDate
        ? new Date(rentDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            })
        : 'Unknown Date';

    // Show loading if any async data is not ready
    if (!telegramId || loadingUser || loadingVehicle) return (
        <div className="bg-white min-h-screen flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (userError) return <div>Error loading user</div>;
    if (vehicleError) return <div>Error loading vehicle</div>;
    if (!vehicle) return <div>Vehicle not found</div>;

    const person_info = {
        name: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Guest User',
        phone: user?.phone_number || "+855 12 345 678",
    };

    const vehicleName = vehicle?.name || 'Unknown Vehicle';
    const shopName = vehicle?.shop?.name || 'Unknown Shop';
    const quantity = 1;

    const subTotal = Number(vehicle?.rental_price_per_day) || 0;
    const discount = coupon === 'SAVE10' ? subTotal * 0.1 : 0;
    const total = subTotal - discount;

    const formatMoney = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
    }).format(value);

    const handleCheckout = () => {
        if (!agreed) {
            setErrorMessage('You must agree with the Terms & Conditions before continuing.');
            return;
        }
        setErrorMessage('');
        const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
        router.push(`/payment-option/${encodeURIComponent(vehicle.id)}${qs}`);
    };

    const handleBack = () => router.push('/');

    return (
        <div className="h-screen bg-white flex flex-col items-center overflow-hidden">
            <div className="w-full text-black flex items-center justify-center relative px-4 py-5 flex-shrink-0">
                <ChevronLeft
                    className="w-6 h-6 cursor-pointer absolute left-4"
                    onClick={handleBack}
                />
                <h1 className="text-xl font-semibold">Booking Confirmation</h1>
            </div>

            <div className="w-full lg:max-w-sm mt-6 px-4 space-y-6 text-black">
                {/* Information */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-semibold mb-3">Information</h2>
                    <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {person_info.name}</p>
                        <p><span className="font-medium">Phone Number:</span> +{person_info.phone}</p>
                        <p><span className="font-medium">Vehicle:</span> {vehicleName}</p>
                        <p><span className="font-medium">Rent Date:</span> {formattedDate}</p>
                        <p><span className="font-medium">Shop:</span> {shopName}</p>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-semibold mb-3">Payment Summary</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Quantity:</span><span>{quantity}</span></div>
                        <div className="flex justify-between"><span>Sub Total:</span><span>{formatMoney(subTotal)}</span></div>
                        <div className="flex justify-between"><span>Discount:</span><span className="text-green-600">-{formatMoney(discount)}</span></div>

                        <div className="mt-2">
                            <label className="block text-sm mb-1">Do you have a coupon?</label>
                            <input
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                placeholder="Enter coupon code"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">Try code <span className="font-medium">SAVE10</span> for a 10% discount.</p>
                        </div>

                        <div className="flex justify-between border-t mt-3 pt-2 font-medium text-base">
                            <span>Total:</span>
                            <span>{formatMoney(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Terms & Checkout */}
                <div className="flex flex-col">
                    <div className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 border-gray-400 rounded" />
                        <label>I agree with the <span className="text-blue-600 cursor-pointer">Terms & Conditions</span>.</label>
                    </div>
                    {errorMessage && (<p className="text-red-600 text-sm mt-1">{errorMessage}</p>)}
                </div>

                <Button variant="secondary" className="w-full py-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition" onClick={handleCheckout}>
                    Checkout
                </Button>
            </div>
        </div>
    );
}