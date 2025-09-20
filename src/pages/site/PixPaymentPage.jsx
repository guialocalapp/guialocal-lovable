import React, { useEffect, useState, useCallback } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { Helmet } from 'react-helmet-async';
    import QRCode from 'qrcode.react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Loader2, Copy, CheckCircle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { usePayments } from '@/hooks/usePayments';
    import { useAuth } from '@/hooks/useAuth';

    const PixPaymentPage = () => {
        const location = useLocation();
        const navigate = useNavigate();
        const { toast } = useToast();
        const { getPaymentById, loading: paymentsLoading } = usePayments();
        const { refreshUserProfile } = useAuth();
        const { localPaymentId } = location.state || {};
        
        const [payment, setPayment] = useState(null);
        const [loading, setLoading] = useState(true);
        const [paymentConfirmed, setPaymentConfirmed] = useState(false);

        const checkPaymentStatus = useCallback(async () => {
            if (!localPaymentId || paymentConfirmed) return;

            const currentPayment = await getPaymentById(localPaymentId);
            setPayment(currentPayment);
            
            if (currentPayment && (currentPayment.status === 'CONFIRMED' || currentPayment.status === 'RECEIVED')) {
                setPaymentConfirmed(true);
                await refreshUserProfile();
            }
        }, [localPaymentId, getPaymentById, paymentConfirmed, refreshUserProfile]);

        useEffect(() => {
            if (!localPaymentId) {
                toast({
                    title: "Erro",
                    description: "Nenhum ID de pagamento foi fornecido. Redirecionando...",
                    variant: "destructive"
                });
                navigate('/client/plans');
                return;
            }

            const fetchInitialData = async () => {
                const initialPayment = await getPaymentById(localPaymentId);
                setPayment(initialPayment);
                setLoading(false);

                if (initialPayment && (initialPayment.status === 'CONFIRMED' || initialPayment.status === 'RECEIVED')) {
                    setPaymentConfirmed(true);
                    await refreshUserProfile();
                }
            };

            fetchInitialData();
        }, [localPaymentId, navigate, toast, getPaymentById, refreshUserProfile]);
        
        useEffect(() => {
            if (paymentConfirmed) return;

            const interval = setInterval(() => {
                checkPaymentStatus();
            }, 5000);

            return () => clearInterval(interval);
        }, [checkPaymentStatus, paymentConfirmed]);

        const copyToClipboard = () => {
            if (payment?.pix_payload) {
                navigator.clipboard.writeText(payment.pix_payload);
                toast({ title: "Copiado!", description: "O código PIX foi copiado para sua área de transferência." });
            }
        };

        if (loading || paymentsLoading) {
            return (
                <div className="flex justify-center items-center h-screen bg-background">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            );
        }

        if (paymentConfirmed) {
            return (
                 <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                    <Helmet>
                        <title>Pagamento Aprovado - Guia Local</title>
                    </Helmet>
                    <Card className="w-full max-w-md text-center shadow-2xl bg-card border-green-500">
                        <CardHeader>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="mt-4 text-2xl font-bold">Pagamento Aprovado!</CardTitle>
                            <CardDescription>
                                Seu pagamento foi confirmado com sucesso. Seu novo plano já está ativo!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={() => navigate('/client/dashboard')} className="w-full">
                                Acessar meu painel
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        if (!payment || !payment.pix_qr_code || !payment.pix_payload) {
            return (
                <div className="flex flex-col justify-center items-center h-screen bg-background text-center">
                    <h1 className="text-2xl font-bold mb-4">Erro ao gerar PIX</h1>
                    <p className="text-muted-foreground mb-8">Não foi possível carregar os dados do pagamento. Por favor, tente novamente.</p>
                    <Button onClick={() => navigate('/client/plans')}>Voltar aos Planos</Button>
                </div>
            );
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
                <Helmet>
                    <title>Pagamento PIX - Guia Local</title>
                </Helmet>
                <Card className="w-full max-w-md text-center shadow-2xl bg-card">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Pague com PIX</CardTitle>
                        <CardDescription>
                            Abra o app do seu banco e escaneie o QR Code abaixo ou copie o código.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <div className="p-4 bg-white rounded-lg">
                            <QRCode value={payment.pix_payload} size={256} />
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Aguardando confirmação do pagamento...
                        </div>
                        <Button onClick={copyToClipboard} variant="outline" className="w-full">
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar Código PIX
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    };

    export default PixPaymentPage;