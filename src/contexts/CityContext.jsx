import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchCities = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('cities').select('*').order('name');
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar cidades", description: error.message });
        } else {
            setCities(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    const addCity = async (cityData) => {
        const { data, error } = await supabase.from('cities').insert([cityData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar cidade", description: error.message });
            return null;
        }
        toast({ title: "Cidade adicionada com sucesso!" });
        setCities(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        return data[0];
    };

    const deleteCity = async (id) => {
        const { error } = await supabase.from('cities').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar cidade", description: error.message });
            return false;
        }
        toast({ title: "Cidade deletada com sucesso!" });
        setCities(prev => prev.filter(city => city.id !== id));
        return true;
    };
    
    const getCityById = useCallback((id) => {
        return cities.find(city => city.id === id);
    }, [cities]);

    return (
        <CityContext.Provider value={{ cities, loading, addCity, deleteCity, fetchCities, getCityById }}>
            {children}
        </CityContext.Provider>
    );
};