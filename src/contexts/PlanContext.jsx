import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('plans').select('*').order('order_index');
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar planos", description: error.message });
        } else {
            setPlans(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const addPlan = async (planData) => {
        const { data, error } = await supabase.from('plans').insert([planData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar plano", description: error.message });
            return null;
        }
        toast({ title: "Plano adicionado com sucesso!" });
        await fetchPlans();
        return data[0];
    };

    const updatePlan = async (id, planData) => {
        const { data, error } = await supabase.from('plans').update(planData).eq('id', id).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar plano", description: error.message });
            return null;
        }
        toast({ title: "Plano atualizado com sucesso!" });
        await fetchPlans();
        return data[0];
    };

    const deletePlan = async (id) => {
        const { error } = await supabase.from('plans').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar plano", description: error.message });
            return false;
        }
        toast({ title: "Plano deletado com sucesso!" });
        await fetchPlans();
        return true;
    };

    const getPlanById = useCallback((id) => {
        return plans.find(p => p.id === id);
    }, [plans]);

    return (
        <PlanContext.Provider value={{ plans, loading, addPlan, updatePlan, deletePlan, getPlanById, fetchPlans }}>
            {children}
        </PlanContext.Provider>
    );
};