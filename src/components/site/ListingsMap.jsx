import React, { useRef, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxContext } from '@/contexts/MapboxContext';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ListingsMap = ({ listings, onMove, mapNeedsUpdate, onMapUpdated }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const { mapboxToken, mapboxSettings } = useContext(MapboxContext);
    const isMapReady = useRef(false);
    const popups = useRef([]);

    const getGeoJSON = (listings) => ({
        type: 'FeatureCollection',
        features: listings
            .filter(ad => ad.latitude && ad.longitude)
            .map(ad => ({
                type: 'Feature',
                properties: {
                    id: ad.id,
                    title: ad.title,
                    category: ad.categories?.name,
                    slug: ad.slug,
                    image: ad.images?.[0] || 'https://via.placeholder.com/150',
                },
                geometry: {
                    type: 'Point',
                    coordinates: [Number(ad.longitude), Number(ad.latitude)],
                },
            })),
    });

    const PopupContent = ({ properties }) => (
        <div className="w-48 text-foreground">
            <img  alt={properties.title} className="w-full h-24 object-cover rounded-t-lg" src={properties.image} />
            <div className="p-2">
                <h4 className="font-bold text-sm truncate">{properties.title}</h4>
                <p className="text-xs text-muted-foreground">{properties.category}</p>
                 <Button size="sm" className="w-full mt-2" onClick={() => window.open(`/anuncio/${properties.slug}`, '_blank')}>
                    Ver Detalhes
                </Button>
            </div>
        </div>
    );

    const fitBounds = (listingsToFit) => {
        if (!map.current || !isMapReady.current || listingsToFit.length === 0) return;
        
        const bounds = new mapboxgl.LngLatBounds();
        listingsToFit.forEach(ad => {
            if(ad.longitude && ad.latitude) {
               bounds.extend([Number(ad.longitude), Number(ad.latitude)]);
            }
        });
        
        if (!bounds.isEmpty()) {
             map.current.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 });
        }
    };

    useEffect(() => {
        if (!mapboxToken || !mapContainer.current || map.current) return;
        
        mapboxgl.accessToken = mapboxToken;
        const style = mapboxSettings.style || 'mapbox://styles/mapbox/streets-v12';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: style,
            center: [-51.043, -29.948],
            zoom: 11
        });
        
        map.current.on('load', () => {
            isMapReady.current = true;
            const sourceId = 'listings-source';
            
            map.current.addSource(sourceId, {
                type: 'geojson',
                data: getGeoJSON([]),
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });
            
            map.current.addLayer({
                id: 'clusters',
                type: 'circle',
                source: sourceId,
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step', ['get', 'point_count'],
                        '#16a3b5', 10, '#0f7685', 20, '#0d5d68' // Teal shades
                    ],
                    'circle-radius': [
                        'step', ['get', 'point_count'],
                        20, 10, 30, 20, 40
                    ]
                }
            });

            map.current.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: sourceId,
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                },
                paint: {
                    'text-color': '#ffffff'
                }
            });
            
            const markerEl = document.createElement('div');
            markerEl.innerHTML = renderToStaticMarkup(<MapPin className="text-primary h-8 w-8" fill="white" />);
            const svgString = new XMLSerializer().serializeToString(markerEl.firstChild);

            map.current.loadImage(
              `data:image/svg+xml;base64,${btoa(svgString)}`,
              (error, image) => {
                if (error) throw error;
                if (map.current && !map.current.hasImage('custom-marker')) {
                  map.current.addImage('custom-marker', image, { sdf: true });
                }
                
                map.current.addLayer({
                    id: 'unclustered-point',
                    type: 'symbol',
                    source: sourceId,
                    filter: ['!', ['has', 'point_count']],
                    layout: {
                      'icon-image': 'custom-marker',
                      'icon-allow-overlap': false,
                      'icon-size': 1.5
                    }
                });
              }
            );

            map.current.on('click', 'clusters', (e) => {
                const features = map.current.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                const clusterId = features[0].properties.cluster_id;
                map.current.getSource(sourceId).getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err) return;
                    map.current.easeTo({ center: features[0].geometry.coordinates, zoom: zoom });
                });
            });
            
            map.current.on('click', 'unclustered-point', (e) => {
                popups.current.forEach(popup => popup.remove());
                popups.current = [];

                const coordinates = e.features[0].geometry.coordinates.slice();
                const properties = e.features[0].properties;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                const popupContent = renderToStaticMarkup(<PopupContent properties={properties} />);

                const popup = new mapboxgl.Popup({ 
                    closeButton: false, 
                    className: 'custom-popup' 
                })
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(map.current);
                popups.current.push(popup);
            });
            
            map.current.on('mouseenter', 'clusters', () => { map.current.getCanvas().style.cursor = 'pointer'; });
            map.current.on('mouseleave', 'clusters', () => { map.current.getCanvas().style.cursor = ''; });
            map.current.on('mouseenter', 'unclustered-point', () => { map.current.getCanvas().style.cursor = 'pointer'; });
            map.current.on('mouseleave', 'unclustered-point', () => { map.current.getCanvas().style.cursor = ''; });

            map.current.on('moveend', () => onMove(map.current.getBounds()));

            if (listings.length > 0) {
                fitBounds(listings);
            }
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
                isMapReady.current = false;
            }
        };

    }, [mapboxToken, mapboxSettings]);

    useEffect(() => {
        if (!map.current || !isMapReady.current) return;

        const source = map.current.getSource('listings-source');
        if (source) {
            source.setData(getGeoJSON(listings));
        }

        if (mapNeedsUpdate) {
            fitBounds(listings);
            onMapUpdated();
        }

    }, [listings, mapNeedsUpdate]);

    if (!mapboxToken) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-secondary rounded-lg">
                <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Funcionalidade de mapa indisponível.</p>
                <p className="text-muted-foreground text-sm">Configure a chave de API do Mapbox.</p>
            </div>
        );
    }

    return <div ref={mapContainer} className="h-full w-full" />;
};

export default ListingsMap;