import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers deve ser usado dentro de um UserProvider');
  }
  return context;
};