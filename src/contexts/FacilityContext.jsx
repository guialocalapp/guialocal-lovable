import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as LucideIcons from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

export const FacilityContext = createContext();

export const FacilityProvider = ({ children }) => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchFacilities = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('facilities').select('*').order('name');
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar facilidades", description: error.message });
        } else {
            setFacilities(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    const addFacility = async (facilityData) => {
        const { data, error } = await supabase.from('facilities').insert([facilityData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar facilidade", description: error.message });
            return null;
        }
        toast({ title: "Facilidade adicionada com sucesso!" });
        setFacilities(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        return data[0];
    };

    const updateFacility = async (id, facilityData) => {
        const { data, error } = await supabase.from('facilities').update(facilityData).eq('id', id).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar facilidade", description: error.message });
            return null;
        }
        toast({ title: "Facilidade atualizada com sucesso!" });
        setFacilities(prev => prev.map(f => (f.id === id ? data[0] : f)).sort((a, b) => a.name.localeCompare(b.name)));
        return data[0];
    };

    const deleteFacility = async (id) => {
        const { error } = await supabase.from('facilities').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar facilidade", description: error.message });
            return false;
        }
        toast({ title: "Facilidade deletada com sucesso!" });
        setFacilities(prev => prev.filter(f => f.id !== id));
        return true;
    };

    const getFacilityById = useCallback((id) => {
        return facilities.find(f => f.id === id);
    }, [facilities]);
    
    const toPascalCase = (str) => {
      if (!str || typeof str !== 'string') return '';
      return str
        .replace(/-/g, ' ')
        .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
        .replace(/ /g, '');
    };

    const getFacilityIcon = (iconName) => {
        if (!iconName) return LucideIcons.HelpCircle;
        const pascalCaseName = toPascalCase(iconName);
        const IconComponent = LucideIcons[pascalCaseName];
        return IconComponent || LucideIcons.HelpCircle;
    };

    const value = useMemo(() => ({
        facilities,
        loading,
        addFacility,
        updateFacility,
        deleteFacility,
        getFacilityById,
        fetchFacilities,
        getFacilityIcon
    }), [facilities, loading, getFacilityById, fetchFacilities]);

    return (
        <FacilityContext.Provider value={value}>
            {children}
        </FacilityContext.Provider>
    );
};