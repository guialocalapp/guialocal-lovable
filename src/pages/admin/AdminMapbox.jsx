import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMapbox } from '@/contexts/MapboxContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Map, Link as LinkIcon, Loader2 } from 'lucide-react';

const mapStyles = [
    { id: 'mapbox://styles/mapbox/streets-v12', name: 'Ruas (Padrão)' },
    { id: 'mapbox://styles/mapbox/outdoors-v12', name: 'Ar Livre' },
    { id: 'mapbox://styles/mapbox/light-v11', name: 'Claro' },
    { id: 'mapbox://styles/mapbox/dark-v11', name: 'Escuro' },
    { id: 'mapbox://styles/mapbox/satellite-v9', name: 'Satélite' },
    { id: 'mapbox://styles/mapbox/satellite-streets-v12', name: 'Satélite com Ruas' },
    { id: 'mapbox://styles/mapbox/navigation-day-v1', name: 'Navegação (Dia)' },
    { id: 'mapbox://styles/mapbox/navigation-night-v1', name: 'Navegação (Noite)' },
];

const AdminMapbox = () => {
    const { mapboxSettings, saveMapboxSettings, loading } = useMapbox();
    const { toast } = useToast();

    const [publicApiKey, setPublicApiKey] = useState('');
    const [secretApiKey, setSecretApiKey] = useState('');
    const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
    const [mapZoom, setMapZoom] = useState([15]);

    useEffect(() => {
        if (mapboxSettings) {
            setMapStyle(mapboxSettings.style || 'mapbox://styles/mapbox/streets-v12');
            setMapZoom([mapboxSettings.zoom || 15]);
        }
    }, [mapboxSettings]);

    const handleSave = () => {
        const settingsToSave = {
            zoom: mapZoom[0],
            style: mapStyle
        };
        
        if (publicApiKey) {
            settingsToSave.publicApiKey = publicApiKey;
        }
        if (secretApiKey) {
            settingsToSave.apiKey = secretApiKey;
        }

        saveMapboxSettings(settingsToSave);
    };

    return (
        <>
            <Helmet>
                <title>Configuração Mapbox - Admin - Guia Local</title>
            </Helmet>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Configuração do Mapbox</h2>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Map className="mr-2 h-6 w-6" />
                        Configurações do Mapa
                    </CardTitle>
                    <CardDescription>
                        Personalize a aparência e o comportamento dos mapas de localização.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="mapbox-public-api-key">Seu Token de Acesso Público (Public)</Label>
                        <Input
                            id="mapbox-public-api-key"
                            type="password"
                            placeholder={mapboxSettings?.publicApiKey ? "Chave já configurada. Insira uma nova para alterar." : "pk.eyJ..."}
                            value={publicApiKey}
                            onChange={(e) => setPublicApiKey(e.target.value)}
                            disabled={loading}
                        />
                         <p className="text-sm text-muted-foreground">
                            Esta chave é usada no lado do cliente para exibir os mapas.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mapbox-secret-api-key">Seu Token de Acesso Secreto (Secret)</Label>
                        <Input
                            id="mapbox-secret-api-key"
                            type="password"
                            placeholder={mapboxSettings?.apiKey ? "Chave já configurada. Insira uma nova para alterar." : "sk.eyJ..."}
                            value={secretApiKey}
                            onChange={(e) => setSecretApiKey(e.target.value)}
                            disabled={loading}
                        />
                         <p className="text-sm text-muted-foreground">
                            Esta chave é usada no lado do servidor para geocodificação.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="map-style">Estilo do Mapa</Label>
                        <Select value={mapStyle} onValueChange={setMapStyle} disabled={loading}>
                            <SelectTrigger id="map-style">
                                <SelectValue placeholder="Selecione um estilo" />
                            </SelectTrigger>
                            <SelectContent>
                                {mapStyles.map((style) => (
                                    <SelectItem key={style.id} value={style.id}>
                                        {style.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="map-zoom">Nível de Zoom Padrão</Label>
                            <span className="w-12 rounded-md bg-gray-800 px-2 py-1 text-center text-sm text-white">
                                {mapZoom[0]}
                            </span>
                        </div>
                        <Slider
                            id="map-zoom"
                            min={1}
                            max={22}
                            step={1}
                            value={mapZoom}
                            onValueChange={setMapZoom}
                            disabled={loading}
                        />
                         <p className="text-sm text-muted-foreground">
                            Define o zoom inicial do mapa quando um anúncio é visualizado.
                        </p>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between items-center">
                   <a
                        href="https://account.mapbox.com/access-tokens/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                    >
                        <LinkIcon className="mr-1 h-4 w-4" />
                        Ir para o painel do Mapbox
                    </a>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Configurações
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};

export default AdminMapbox;