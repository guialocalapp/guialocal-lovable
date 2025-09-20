import { useContext } from 'react';
import { PaymentContext } from '@/contexts/PaymentContext';

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
};