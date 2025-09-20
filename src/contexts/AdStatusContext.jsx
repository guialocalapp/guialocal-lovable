import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const AdStatusContext = createContext();

export const AdStatusProvider = ({ children }) => {
    const [adStatuses, setAdStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchAdStatuses = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('listing_statuses').select('*');
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar status de anúncios", description: error.message });
        } else {
            setAdStatuses(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchAdStatuses();
    }, [fetchAdStatuses]);

    const addStatus = async (statusData) => {
        const { data, error } = await supabase.from('listing_statuses').insert([statusData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar status", description: error.message });
            return null;
        }
        toast({ title: "Status adicionado com sucesso!" });
        setAdStatuses(prev => [...prev, data[0]]);
        return data[0];
    };

    const updateStatus = async (id, statusData) => {
        const { data, error } = await supabase.from('listing_statuses').update(statusData).eq('id', id).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar status", description: error.message });
            return null;
        }
        toast({ title: "Status atualizado com sucesso!" });
        setAdStatuses(prev => prev.map(s => (s.id === id ? data[0] : s)));
        return data[0];
    };

    const deleteStatus = async (id) => {
        const { error } = await supabase.from('listing_statuses').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar status", description: error.message });
            return false;
        }
        toast({ title: "Status deletado com sucesso!" });
        setAdStatuses(prev => prev.filter(s => s.id !== id));
        return true;
    };


    return (
        <AdStatusContext.Provider value={{ statuses: adStatuses, loading, fetchAdStatuses, addStatus, updateStatus, deleteStatus }}>
            {children}
        </AdStatusContext.Provider>
    );
};

export const useAdStatus = () => {
  const context = useContext(AdStatusContext);
  if (context === undefined) {
    throw new Error('useAdStatus must be used within an AdStatusProvider');
  }
  return context;
};