'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useSearchParams } from "next/navigation";
import useVehicleDetail from '@/features/vehicles/hooks/useVehicleDetail';
import useUser from "@/features/booking/hooks/useUser";
import Radio from "./Radio";
import Button from "../core/Button";
import dynamic from "next/dynamic";

const WebApp = dynamic(() => import("@twa-dev/sdk"), { ssr: false });

export default function PaymentOptionPageClient({ vehicleId }) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ⬅️ new state
  const fallbackTelegramId = process.env.NEXT_PUBLIC_FALLBACK_TELEGRAM_ID;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const formattedStart = start
    ? new Date(start).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const [telegramId, setTelegramId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@twa-dev/sdk").then((mod) => {
        const WebApp = mod.default;
        WebApp.ready();
        const id = WebApp.initDataUnsafe?.user?.id;
        setTelegramId(id ?? fallbackTelegramId ?? 836720428);
      });
    }
  }, []);

  const paymentMethods = [
    { name: 'ABA', description: 'Tap to pay with ABA Mobile', image: '/images/payment/ABA.png' },
    { name: 'KHQR', description: 'Scan and pay with member bank app', image: '/images/payment/KHQR.png' },
    { name: 'Cash Payment', description: 'Pay with cash at pickup', image: '/images/payment/Cash.png' },
  ];

  const handleBack = () => window.history.back();

  const { user, loading: loadingUser, error: userError } = useUser(telegramId, { autoLoad: !!telegramId });
  const { vehicle, loading: loadingVehicle, error: vehicleError } = useVehicleDetail(vehicleId);

  const formatProvince = (province) => {
    if (!province) return "";
    return province
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedProvince = formatProvince(vehicle?.shop?.location);

  const handleProceed = async () => {
    if (isLoading) return; // prevent double-click
    if (!selectedMethod) {
      setErrorMessage('Please select a payment method.');
      return;
    }
    if (selectedMethod === 'ABA' || selectedMethod === 'KHQR') {
      setErrorMessage('ABA and KHQR payments are coming soon — please choose Cash Payment for now.');
      return;
    }

    const bookingData = {
      user_telegram_id: telegramId,
      user_name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`,
      user_username: user?.username || 'N/A',
      user_phone: user?.phone_number || 'N/A',
      shop_name: vehicle?.shop?.name,
      province: formattedProvince || 'N/A',
      vehicle: vehicle?.name || 'N/A',
      payment_method: selectedMethod,
      rent_date: formattedStart,
    };

    console.log("📦 Booking Data:", bookingData);

    try {
      setIsLoading(true); // ⬅️ start loading
      const response = await fetch(`${apiUrl}/booking/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      console.log("✅ Server response:", result);

      if (response.ok) {
        router.push("/booking-successful");
      } else {
        setErrorMessage(result.message || "Failed to send booking.");
      }
    } catch (error) {
      console.error("❌ Error sending booking:", error);
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false); // ⬅️ stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <div className="w-full flex items-center justify-center relative px-4 py-5 text-black">
        <ChevronLeft onClick={handleBack} className="w-6 h-6 cursor-pointer absolute left-4" />
        <h1 className="text-xl font-semibold">Payment Option</h1>
      </div>

      <div className="max-w-sm w-full mt-6 flex flex-col space-y-4 px-4">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="flex items-center bg-white cursor-pointer transition-all duration-200 p-3 rounded-lg border hover:shadow-sm"
            onClick={() => {
              if (!isLoading) {
                setSelectedMethod(method.name);
                setErrorMessage('');
              }
            }}
            role="button"
            aria-pressed={selectedMethod === method.name}
          >
            <Radio selected={selectedMethod === method.name} error={!!errorMessage && !selectedMethod} />
            <div className="flex flex-col w-full ml-3">
              <p className="text-lg text-black">{method.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-xs">{method.description}</p>
              </div>
            </div>

            <img src={method.image} alt={method.name} className="w-12 h-12 object-contain ml-2" />
          </div>
        ))}

        <div className="mt-2">
          <p
            className={`text-sm ${errorMessage ? 'text-red-500' : 'text-gray-500'}`}
            role="status"
            aria-live="polite"
          >
            {errorMessage || 'Choose a payment method to continue.'}
          </p>
        </div>
      </div>

      <div className="fixed bottom-4 w-full max-w-sm px-4">
        <Button
          onClick={handleProceed}
          variant="secondary"
          className={`w-full flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {isLoading ? "Processing..." : "Proceed"}
        </Button>
      </div>
    </div>
  );
}