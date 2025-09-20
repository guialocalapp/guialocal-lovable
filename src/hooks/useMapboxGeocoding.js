import { useState, useCallback, useContext } from 'react';
import { MapboxContext } from '@/contexts/MapboxContext';
import { useToast } from '@/components/ui/use-toast';

export const useMapboxGeocoding = (options = {}) => {
  const { onGeocode } = options;
  const [loading, setLoading] = useState(false);
  const { mapboxToken } = useContext(MapboxContext);
  const { toast } = useToast();

  const geocode = useCallback(async (address) => {
    if (!address) {
      return;
    }
    
    if (!mapboxToken) {
        console.warn('Mapbox token not available. Skipping geocoding.');
        toast({
            variant: 'destructive',
            title: 'Configuração Incompleta',
            description: 'A chave de API do Mapbox não está configurada. Não é possível buscar as coordenadas.',
        });
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&country=BR&limit=1`);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        if (onGeocode) {
          onGeocode({ latitude, longitude });
        }
      } else {
        console.warn('Geocoding: No results found for the address.');
        if (onGeocode) {
            onGeocode({ latitude: null, longitude: null });
        }
        toast({
            variant: 'destructive',
            title: 'Localização não encontrada',
            description: 'Não foi possível encontrar coordenadas para o endereço fornecido.',
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro de Geocodificação',
        description: 'Ocorreu um erro ao buscar as coordenadas para o endereço.',
      });
    } finally {
      setLoading(false);
    }
  }, [mapboxToken, onGeocode, toast]);

  return { geocode, loading };
};