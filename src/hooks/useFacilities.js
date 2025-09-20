import { useContext } from 'react';
import { FacilityContext } from '@/contexts/FacilityContext';

export const useFacilities = () => {
    const context = useContext(FacilityContext);
    if (context === undefined) {
        throw new Error('useFacilities must be used within a FacilityProvider');
    }
    return context;
};