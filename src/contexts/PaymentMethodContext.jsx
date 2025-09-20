import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const PaymentMethodContext = createContext();

export const PaymentMethodProvider = ({ children }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPaymentMethods = useCallback(async () => {
        setLoading(true);
        console.log("Fetch payment methods is disabled as Supabase is disconnected.");
        setPaymentMethods([]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const addPaymentMethod = async (methodData) => {
        toast({ variant: "destructive", title: "Função desabilitada", description: "Não é possível adicionar métodos de pagamento no momento." });
        return null;
    };

    const updatePaymentMethod = async (id, methodData) => {
        toast({ variant: "destructive", title: "Função desabilitada", description: "Não é possível atualizar métodos de pagamento no momento." });
        return null;
    };

    const deletePaymentMethod = async (id) => {
        toast({ variant: "destructive", title: "Função desabilitada", description: "Não é possível deletar métodos de pagamento no momento." });
        return false;
    };

    return (
        <PaymentMethodContext.Provider value={{ paymentMethods, loading, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, fetchPaymentMethods }}>
            {children}
        </PaymentMethodContext.Provider>
    );
};