'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from '@/components/core/Button';

export default function BookingSuccessful() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleBackHome = () => {
    router.push('/'); // simply navigate back to home
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6 animate-fadeIn">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Booking Successful!</h1>
      <p className="text-gray-500 mb-8">
        Your vehicle has been successfully booked. We’ve sent your booking details via email.
      </p>
      <Button
        onClick={handleBackHome}
        variant="secondary"
        className="w-full max-w-sm"
      >
        Back to Home
      </Button>
    </div>
  );
}
