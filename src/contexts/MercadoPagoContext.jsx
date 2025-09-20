
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { initMercadoPago, createCardToken } from '@mercadopago/sdk-react';

const MercadoPagoContext = createContext();

export const MercadoPagoProvider = ({ children }) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isMercadoPagoReady, setIsMercadoPagoReady] = useState(false);

    const initializeMercadoPago = useCallback(async () => {
        if (isMercadoPagoReady) return;
        try {
            const { data: publicSettings, error: publicSettingsError } = await supabase.functions.invoke('get-public-settings', {
                body: { settings: ['payment_gateways'] }
            });

            if (publicSettingsError) throw publicSettingsError;

            const publicKey = publicSettings?.data?.payment_gateways?.mercado_pago?.publicKey;
            if (publicKey) {
                await initMercadoPago(publicKey, { locale: 'pt-BR' });
                setIsMercadoPagoReady(true);
            } else {
                console.error('Mercado Pago Public Key not found.');
            }
        } catch (error) {
            console.error('Failed to initialize Mercado Pago:', error);
            toast({
                variant: 'destructive',
                title: 'Erro de Configuração',
                description: 'Não foi possível carregar as configurações de pagamento.',
            });
        }
    }, [toast, isMercadoPagoReady]);

    const generateCardToken = useCallback(async (cardData) => {
        if (!isMercadoPagoReady) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'O serviço de pagamento não está pronto. Tente novamente.',
            });
            return null;
        }
        try {
            const token = await createCardToken(cardData);
            return token.id;
        } catch (error) {
            console.error('Error creating card token:', error);
            const errorMessage = error.cause?.[0]?.message || 'Não foi possível validar seu cartão. Verifique os dados e tente novamente.';
            toast({
                variant: 'destructive',
                title: 'Erro no Cartão',
                description: errorMessage,
            });
            return null;
        }
    }, [isMercadoPagoReady, toast]);

    const createSubscription = useCallback(async (payload) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-mercado-pago-subscription', {
                body: payload,
            });

            if (error) {
                const errorMessage = error.message || 'Ocorreu um erro desconhecido.';
                let parsedError = {};
                try {
                    parsedError = JSON.parse(errorMessage.substring(errorMessage.indexOf('{')));
                } catch (e) {
                    // ignore
                }
                throw new Error(parsedError.error || errorMessage);
            }

            if (data.init_point) {
                toast({
                    title: 'Redirecionando para Pagamento',
                    description: 'Você será redirecionado para concluir a assinatura.',
                });
                window.location.href = data.init_point;
            } else if (data.status === 'authorized' || data.status === 'approved') {
                toast({
                    title: 'Pagamento Aprovado!',
                    description: 'Sua assinatura foi ativada com sucesso.',
                });
                navigate('/pagamento-sucesso');
            } else {
                 throw new Error(data.message || 'Pagamento não autorizado. Verifique os dados e tente novamente.');
            }

            return { success: true, data };
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Erro na Transação',
                description: err.message,
            });
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [toast, navigate]);

    return (
        <MercadoPagoContext.Provider value={{ loading, createSubscription, initializeMercadoPago, generateCardToken, isMercadoPagoReady }}>
            {children}
        </MercadoPagoContext.Provider>
    );
};

export const useMercadoPago = () => {
    const context = useContext(MercadoPagoContext);
    if (context === undefined) {
        throw new Error('useMercadoPago must be used within a MercadoPagoProvider');
    }
    return context;
};
