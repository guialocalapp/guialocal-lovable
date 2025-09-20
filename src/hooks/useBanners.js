import { useContext } from 'react';
import { BannerContext } from '@/contexts/BannerContext';

export const useBanners = () => {
    const context = useContext(BannerContext);
    if (context === undefined) {
        throw new Error('useBanners must be used within a BannerProvider');
    }
    return context;
};