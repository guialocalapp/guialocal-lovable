import { useContext } from 'react';
import { PlanContext } from '@/contexts/PlanContext';

export const usePlans = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlans must be used within a PlanProvider');
  }
  return context;
};