import { useContext } from 'react';
import { PaymentMethodContext } from '@/contexts/PaymentMethodProvider.jsx';

export const usePaymentMethods = () => {
    const context = useContext(PaymentMethodContext);
    if (!context) {
        throw new Error('usePaymentMethods must be used within a PaymentMethodProvider');
    }
    return context;
};