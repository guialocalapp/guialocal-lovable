import { useState, useCallback } from 'react';

export const useMapSync = () => {
    const [mapBounds, setMapBounds] = useState(null);
    const [mapNeedsUpdate, setMapNeedsUpdate] = useState(true);

    const handleMapMove = useCallback((bounds) => {
        setMapBounds(bounds);
        setMapNeedsUpdate(false);
    }, []);

    const resetMapNeedsUpdate = useCallback(() => {
        setMapNeedsUpdate(false);
    }, []);
    
    const triggerMapUpdate = useCallback(() => {
        setMapNeedsUpdate(true);
    }, []);

    return {
        mapBounds,
        mapNeedsUpdate,
        handleMapMove,
        resetMapNeedsUpdate,
        triggerMapUpdate,
    };
};