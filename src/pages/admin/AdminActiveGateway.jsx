
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminActiveGateway = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Gateway de Pagamento - Admin</title>
            </Helmet>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Gateway de Pagamento</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Gateway de Pagamento Ativo</CardTitle>
                        <CardDescription>O Mercado Pago é o provedor de pagamento ativo para processar as transações de assinatura.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4 rounded-md border p-4">
                            <div className="flex-1">
                                <Label className="font-semibold text-lg">Mercado Pago</Label>
                                <p className="text-sm text-muted-foreground">Aceite pagamentos com Cartão de Crédito e PIX.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate('/admin/mercadopago-settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                Configurar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminActiveGateway;
