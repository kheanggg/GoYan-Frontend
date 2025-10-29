import { use } from 'react';
import ConfirmationPageClient from '@/components/confirmation/ConfirmationPageClient';

export default function ConfirmationPage({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    
    return (
        <ConfirmationPageClient
            vehicleId={id}
        />
    );
}   