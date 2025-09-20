import { useContext } from 'react';
import { EmailContext } from '@/contexts/EmailContext';

export const useEmailLogs = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmailLogs must be used within an EmailProvider');
  }
  return {
    emailLogs: context.emailLogs,
    loading: context.loading,
  };
};