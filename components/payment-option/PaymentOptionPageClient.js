'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Radio from "./Radio";
import Button from "../core/Button";

export default function PaymentOptionPageClient({ }) {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const paymentMethods = [
        { name: 'ABA', description: 'Tap to pay with ABA Mobile', image: '/images/payment/ABA.png' },
        { name: 'KHQR', description: 'Scan and pay with member bank app', image: '/images/payment/KHQR.png' },
        { name: 'Cash Payment', description: 'Pay with cash at pickup', image: '/images/payment/Cash.png' },
    ];

    const handleBack = () => window.history.back();

    const handleProceed = () => {
        if (!selectedMethod) {
            setErrorMessage('Please select a payment method.');
            return;
        }
        if (selectedMethod === 'ABA' || selectedMethod === 'KHQR') {
            setErrorMessage('ABA and KHQR payments are coming soon — please choose Cash Payment for now.');
            return;
        }
        router.push('/booking-successful');
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-white">
            <div className="w-full flex items-center justify-center relative px-4 py-5 text-black">
                <ChevronLeft onClick={handleBack} className="w-6 h-6 cursor-pointer absolute left-4" />
                <h1 className="text-xl font-semibold">Payment Option</h1>
            </div>

            <div className="max-w-sm w-full mt-6 flex flex-col space-y-4 px-4">
                {paymentMethods.map((method) => (
                    <div key={method.name} className="flex items-center bg-white cursor-pointer transition-all duration-200 p-3 rounded-lg border hover:shadow-sm" onClick={() => { setSelectedMethod(method.name); setErrorMessage(''); }} role="button" aria-pressed={selectedMethod === method.name}>
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
                    <p className={`text-sm ${errorMessage ? 'text-red-500' : 'text-gray-500'}`} role="status" aria-live="polite">
                        {errorMessage || 'Choose a payment method to continue.'}
                    </p>
                </div>
            </div>

            <div className="fixed bottom-4 w-full max-w-sm px-4">
                <Button onClick={handleProceed} variant="secondary" className="w-full">Proceed</Button>
            </div>

        </div>
    );
}