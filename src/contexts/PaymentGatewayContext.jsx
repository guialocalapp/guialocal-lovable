
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const PaymentGatewayContext = createContext();

export const PaymentGatewayProvider = ({ children }) => {
    const { toast } = useToast();
    const [settings, setSettings] = useState({
        activeGateway: 'mercado_pago',
        mercado_pago: { publicKey: '', accessToken: '' },
    });
    const [loading, setLoading] = useState(true);

    const fetchGatewaySettings = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('get-public-settings', {
                body: { settings: ['payment_gateways'] }
            });

            if (error) throw error;

            if (data) {
                setSettings(prev => ({ ...prev, ...data.payment_gateways }));
            }
        } catch (error) {
            console.error('Error fetching gateway settings:', error);
            toast({
                variant: 'destructive',
                title: 'Erro ao carregar configurações',
                description: 'Não foi possível buscar as configurações do gateway de pagamento.',
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchGatewaySettings();
    }, [fetchGatewaySettings]);

    const saveGatewaySettings = useCallback(async (gatewayId, newSettings, isActivation = false) => {
        setLoading(true);
        try {
            const payload = isActivation
                ? { activeGateway: newSettings }
                : { [gatewayId]: newSettings };

            const { error } = await supabase.functions.invoke('save-settings', {
                body: {
                    settingId: 'payment_gateways',
                    value: { ...settings, ...payload }
                }
            });

            if (error) throw error;

            setSettings(prev => ({ ...prev, ...payload }));
            toast({
                title: 'Configurações salvas!',
                description: 'As configurações do gateway de pagamento foram atualizadas com sucesso.',
            });
        } catch (error) {
            console.error('Error saving gateway settings:', error);
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar',
                description: 'Não foi possível salvar as configurações do gateway de pagamento.',
            });
        } finally {
            setLoading(false);
        }
    }, [settings, toast]);

    return (
        <PaymentGatewayContext.Provider value={{ settings, loading, saveGatewaySettings, fetchGatewaySettings }}>
            {children}
        </PaymentGatewayContext.Provider>
    );
};

export const usePaymentGateway = () => {
    const context = useContext(PaymentGatewayContext);
    if (context === undefined) {
        throw new Error('usePaymentGateway must be used within a PaymentGatewayProvider');
    }
    return context;
};
  