import { useContext } from 'react';
    import { AdStatusContext } from '@/contexts/AdStatusContext';
    
    export const useAdStatus = () => {
      const context = useContext(AdStatusContext);
      if (context === undefined) {
        throw new Error('useAdStatus must be used within an AdStatusProvider');
      }
      return context;
    };