import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const PaymentMethodContext = createContext();

export const PaymentMethodProvider = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPaymentMethods = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('payment_methods').select('*').order('name');
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar métodos de pagamento", description: error.message });
        } else {
            setPaymentMethods(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const addPaymentMethod = async (methodData) => {
        const { data, error } = await supabase.from('payment_methods').insert([methodData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar método de pagamento", description: error.message });
            return null;
        }
        toast({ title: "Método de pagamento adicionado com sucesso!" });
        setPaymentMethods(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        return data[0];
    };

    const updatePaymentMethod = async (id, methodData) => {
        const { data, error } = await supabase.from('payment_methods').update(methodData).eq('id', id).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar método de pagamento", description: error.message });
            return null;
        }
        toast({ title: "Método de pagamento atualizado com sucesso!" });
        setPaymentMethods(prev => prev.map(m => (m.id === id ? data[0] : m)).sort((a, b) => a.name.localeCompare(b.name)));
        return data[0];
    };

    const deletePaymentMethod = async (id) => {
        const { error } = await supabase.from('payment_methods').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar método de pagamento", description: error.message });
            return false;
        }
        toast({ title: "Método de pagamento deletado com sucesso!" });
        setPaymentMethods(prev => prev.filter(m => m.id !== id));
        return true;
    };

    return (
        <PaymentMethodContext.Provider value={{ paymentMethods, loading, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, fetchPaymentMethods }}>
            {children}
        </PaymentMethodContext.Provider>
    );
};