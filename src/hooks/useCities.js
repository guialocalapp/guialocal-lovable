import { useContext } from 'react';
    import { CityContext } from '@/contexts/CityContext';
    
    export const useCities = () => {
        const context = useContext(CityContext);
        if (!context) {
            throw new Error('useCities must be used within a CityProvider');
        }
        return context;
    };