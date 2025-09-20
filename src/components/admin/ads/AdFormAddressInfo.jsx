import React, { useEffect, useCallback, useState, useContext } from 'react';
import useViaCep from '@/hooks/useViaCep';
import { useCities } from '@/hooks/useCities';
import { useToast } from '@/components/ui/use-toast';
import { useMapboxGeocoding } from '@/hooks/useMapboxGeocoding';
import { useDebounce } from '@/hooks/useDebounce';
import { MapboxContext } from '@/contexts/MapboxContext';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const AdFormAddressInfo = ({ formData, setFormField, setFormFields }) => {
    const { cities } = useCities();
    const { toast } = useToast();
    const [isManualGeocoding, setIsManualGeocoding] = useState(false);
    const { mapboxToken, loading: mapboxLoading } = useContext(MapboxContext);

    const { loading: isCepLoading } = useViaCep(
        formData.zip_code,
        {
            onSuccess: (data) => {
                const cityMatch = cities.find(c => c.name.toLowerCase() === data.localidade.toLowerCase() && c.state.toLowerCase() === data.uf.toLowerCase());
                setFormFields({
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    complement: data.complemento,
                    city_id: cityMatch ? cityMatch.id : formData.city_id
                });
            },
            onError: (error) => {
                toast({ variant: 'destructive', title: "Erro ao buscar CEP", description: error });
            }
        }
    );

    const getFullAddress = useCallback(() => {
        const city = cities.find(c => c.id === formData.city_id);
        if (!formData.street || !formData.number || !formData.neighborhood || !city) {
            return '';
        }
        return `${formData.street}, ${formData.number}, ${formData.neighborhood}, ${city.name}, ${city.state}, Brasil`;
    }, [formData.street, formData.number, formData.neighborhood, formData.city_id, cities]);

    const debouncedAddress = useDebounce(getFullAddress(), 1000);

    const handleGeocodeSuccess = useCallback(({ latitude, longitude }) => {
        setFormFields({ latitude, longitude });
        if (isManualGeocoding) {
            toast({ title: "Localização atualizada!", description: "As coordenadas foram obtidas com sucesso." });
        }
        setIsManualGeocoding(false);
    }, [setFormFields, toast, isManualGeocoding]);

    const { geocode, loading: isGeocoding } = useMapboxGeocoding({ onGeocode: handleGeocodeSuccess });

    useEffect(() => {
        if (debouncedAddress && !isManualGeocoding && mapboxToken) {
            geocode(debouncedAddress);
        }
    }, [debouncedAddress, geocode, isManualGeocoding, mapboxToken]);

    const handleManualGeocode = () => {
        const fullAddress = getFullAddress();
        if (!fullAddress) {
            toast({ variant: "destructive", title: "Endereço incompleto", description: "Preencha rua, número, bairro e cidade para buscar as coordenadas." });
            return;
        }
        setIsManualGeocoding(true);
        geocode(fullAddress);
    };


    const handleZipCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        let maskedValue = value;
        if (value.length > 5) {
            maskedValue = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
        }
        setFormField('zip_code', maskedValue);
    };


    return (
        <div className="space-y-6">
            <CardDescription>Endereço</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 relative">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input 
                        id="zipCode" 
                        value={formData.zip_code} 
                        onChange={handleZipCodeChange} 
                        maxLength={9}
                        placeholder="00000-000"
                        disabled={isCepLoading}
                    />
                    {isCepLoading && <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin" />}
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="street">Logradouro</Label>
                    <Input id="street" value={formData.street} onChange={(e) => setFormField('street', e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" value={formData.number} onChange={(e) => setFormField('number', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" value={formData.complement} onChange={(e) => setFormField('complement', e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" value={formData.neighborhood} onChange={(e) => setFormField('neighborhood', e.target.value)} />
                </div>
            </div>
            <div>
                <Label htmlFor="cityId">Cidade</Label>
                <Select value={formData.city_id || 'null'} onValueChange={(value) => setFormField('city_id', value)} required>
                    <SelectTrigger><SelectValue placeholder="Selecione a cidade" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="null">Selecione uma cidade</SelectItem>
                        {cities.map(city => <SelectItem key={city.id} value={city.id}>{city.name} - {city.state}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-4">
                <Button type="button" variant="outline" onClick={handleManualGeocode} disabled={isGeocoding || mapboxLoading}>
                    {isGeocoding || mapboxLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    {isGeocoding ? 'Buscando...' : (mapboxLoading ? 'Carregando Mapa...' : 'Obter Coordenadas')}
                </Button>
                {formData.latitude && formData.longitude && (
                    <div className="text-sm text-gray-400">
                        <p>Lat: {Number(formData.latitude).toFixed(6)}, Lon: {Number(formData.longitude).toFixed(6)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdFormAddressInfo;