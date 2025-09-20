import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const MapboxContext = createContext();

export const MapboxProvider = ({ children }) => {
    const [mapboxSettings, setMapboxSettings] = useState({
        apiKey: null,
        publicApiKey: null,
        zoom: 15,
        style: 'mapbox://styles/mapbox/streets-v12'
    });
    const [mapboxToken, setMapboxToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            
            const { data: settingsData, error: settingsError } = await supabase.functions.invoke('get-mapbox-settings');
            if (settingsError) {
                toast({
                    title: 'Erro ao buscar configurações do Mapbox',
                    description: settingsError.message,
                    variant: 'destructive',
                });
            } else {
                setMapboxSettings(settingsData || {
                    apiKey: null,
                    publicApiKey: null,
                    zoom: 15,
                    style: 'mapbox://styles/mapbox/streets-v12'
                });
            }

            const { data: tokenData, error: tokenError } = await supabase.functions.invoke('get-mapbox-public-token');
            if (tokenError) {
                 console.warn('Could not fetch Mapbox public token. Map functionality might be limited.');
            } else {
                setMapboxToken(tokenData.publicToken);
            }

            setLoading(false);
        };

        fetchSettings();
    }, [toast]);

    const saveMapboxSettings = async (settings) => {
        setLoading(true);
        const { error } = await supabase.functions.invoke('save-mapbox-settings', {
            body: { settings },
        });
        if (error) {
            toast({
                title: 'Erro ao salvar configurações do Mapbox',
                description: error.message,
                variant: 'destructive',
            });
        } else {
            setMapboxSettings(prevSettings => ({ ...prevSettings, ...settings }));
            if(settings.publicApiKey) {
                setMapboxToken(settings.publicApiKey);
            }
            toast({
                title: 'Configurações do Mapbox salvas com sucesso!',
            });
        }
        setLoading(false);
    };

    const value = {
        mapboxToken,
        mapboxSettings,
        loading,
        saveMapboxSettings,
    }

    return (
        <MapboxContext.Provider value={value}>
            {children}
        </MapboxContext.Provider>
    );
};

export const useMapbox = () => {
    const context = useContext(MapboxContext);
    if (context === undefined) {
        throw new Error('useMapbox must be used within a MapboxProvider');
    }
    return context;
};