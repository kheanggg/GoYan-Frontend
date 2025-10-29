import { use } from 'react';
import PaymentOptionPageClient from '@/components/payment-option/PaymentOptionPageClient';

export default function PaymentOption({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    
    return (
        <PaymentOptionPageClient
            vehicleId={id}
        />
    );
}   