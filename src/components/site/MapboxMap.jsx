import React, { useRef, useEffect, useState, useContext } from 'react';
    import mapboxgl from 'mapbox-gl';
    import 'mapbox-gl/dist/mapbox-gl.css';
    import { MapPin } from 'lucide-react';
    import { MapboxContext } from '@/contexts/MapboxContext';

    const MapboxMap = ({ latitude, longitude }) => {
        const mapContainer = useRef(null);
        const map = useRef(null);
        const marker = useRef(null);
        const { mapboxToken, mapboxSettings } = useContext(MapboxContext);

        const isValidCoordinates = (lat, lng) => {
            return lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng));
        };

        const [hasValidCoordinates, setHasValidCoordinates] = useState(isValidCoordinates(latitude, longitude));

        useEffect(() => {
            setHasValidCoordinates(isValidCoordinates(latitude, longitude));
        }, [latitude, longitude]);

        useEffect(() => {
            if (!mapboxToken || !hasValidCoordinates) return;
            
            mapboxgl.accessToken = mapboxToken;
            const lat = Number(latitude);
            const lon = Number(longitude);
            const zoom = mapboxSettings.zoom || 15;
            const style = mapboxSettings.style || 'mapbox://styles/mapbox/streets-v12';

            if (map.current) {
                map.current.setCenter([lon, lat]);
                map.current.setZoom(zoom);
                map.current.setStyle(style);
                if (marker.current) {
                    marker.current.setLngLat([lon, lat]);
                } else {
                    marker.current = new mapboxgl.Marker({ color: '#16a3b5' }) // Teal color
                        .setLngLat([lon, lat])
                        .addTo(map.current);
                }
                return;
            }

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: style,
                center: [lon, lat],
                zoom: zoom
            });

            marker.current = new mapboxgl.Marker({ color: '#16a3b5' }) // Teal color
                .setLngLat([lon, lat])
                .addTo(map.current);

            return () => {
                if (map.current) {
                    map.current.remove();
                    map.current = null;
                }
            };

        }, [mapboxToken, latitude, longitude, hasValidCoordinates, mapboxSettings]);

        if (!hasValidCoordinates) {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-secondary rounded-lg">
                    <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Localização não disponível.</p>
                </div>
            );
        }

        return <div ref={mapContainer} className="h-full min-h-[300px] rounded-lg" />;
    };

    export default MapboxMap;