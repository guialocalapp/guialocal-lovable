import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('payments')
            .select(`
                *,
                user:user_id ( full_name, email ),
                plan:plan_id ( name )
            `)
            .order('created_at', { ascending: false });
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar pagamentos", description: error.message });
        } else {
            setPayments(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const addPayment = async (paymentData) => {
        const { data, error } = await supabase.from('payments').insert([paymentData]).select().single();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao registrar pagamento", description: error.message });
            return null;
        }
        await fetchPayments();
        return data;
    };

    const updatePayment = async (id, paymentData) => {
        const { data, error } = await supabase.from('payments').update(paymentData).eq('id', id).select().single();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar pagamento", description: error.message });
            return null;
        }
        await fetchPayments();
        return data;
    };
    
    const getPaymentById = useCallback(async (id) => {
        const { data, error } = await supabase.from('payments').select('*').eq('id', id).single();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar pagamento", description: error.message });
            return null;
        }
        return data;
    }, [toast]);

    const getPaymentLogs = useCallback(async (paymentId) => {
        const { data, error } = await supabase
            .from('payment_logs')
            .select('*')
            .eq('payment_id', paymentId)
            .order('created_at', { ascending: false });
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar logs do pagamento", description: error.message });
            return [];
        }
        return data;
    }, [toast]);

    return (
        <PaymentContext.Provider value={{ payments, loading, addPayment, updatePayment, getPaymentById, fetchPayments, getPaymentLogs }}>
            {children}
        </PaymentContext.Provider>
    );
};