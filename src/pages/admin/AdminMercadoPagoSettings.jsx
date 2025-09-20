
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePaymentGateway } from '@/contexts/PaymentGatewayContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, KeyRound, Link as LinkIcon } from 'lucide-react';

const AdminMercadoPagoSettings = () => {
    const { settings, saveGatewaySettings, loading: contextLoading } = usePaymentGateway();
    const [mercadoPagoSettings, setMercadoPagoSettings] = useState({
        publicKey: '',
        accessToken: '',
        clientId: '',
        clientSecret: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setMercadoPagoSettings({
                publicKey: settings.mercadoPago?.publicKey || '',
                accessToken: settings.mercadoPago?.accessToken || '',
                clientId: settings.mercadoPago?.clientId || '',
                clientSecret: settings.mercadoPago?.clientSecret || ''
            });
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        await saveGatewaySettings('mercado_pago', mercadoPagoSettings, false);
        setIsSaving(false);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const keyMap = {
            'mp-public-key': 'publicKey',
            'mp-token': 'accessToken',
            'mp-client-id': 'clientId',
            'mp-client-secret': 'clientSecret'
        };
        setMercadoPagoSettings(prev => ({ ...prev, [keyMap[id]]: value }));
    };

    const isLoading = contextLoading || isSaving;

    return (
        <>
            <Helmet>
                <title>Configuração Mercado Pago - Admin</title>
            </Helmet>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Configuração do Mercado Pago</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound /> Configuração do Mercado Pago
                        </CardTitle>
                        <CardDescription>Insira suas credenciais para habilitar pagamentos com Mercado Pago.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mp-public-key">Public Key</Label>
                            <Input
                                id="mp-public-key"
                                type="text"
                                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={mercadoPagoSettings.publicKey}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mp-token">Access Token</Label>
                            <Input
                                id="mp-token"
                                type="password"
                                placeholder="APP_USR-xxxxxxxxxx"
                                value={mercadoPagoSettings.accessToken}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mp-client-id">Client ID</Label>
                            <Input
                                id="mp-client-id"
                                type="text"
                                placeholder="xxxxxxxxxxxx"
                                value={mercadoPagoSettings.clientId}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mp-client-secret">Client Secret</Label>
                            <Input
                                id="mp-client-secret"
                                type="password"
                                placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                                value={mercadoPagoSettings.clientSecret}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                         <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                            <LinkIcon className="mr-1 h-4 w-4" />
                            Painel de Desenvolvedores
                        </a>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Credenciais
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default AdminMercadoPagoSettings;
  