
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePaymentGateway } from '@/contexts/PaymentGatewayContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, CreditCard, Link as LinkIcon } from 'lucide-react';

const AdminAsaasSettings = () => {
    const { settings, saveGatewaySettings, loading: contextLoading } = usePaymentGateway();
    const [asaasApiKey, setAsaasApiKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setAsaasApiKey(settings.asaas?.apiKey || '');
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        await saveGatewaySettings('asaas', { apiKey: asaasApiKey }, false);
        setIsSaving(false);
    };

    const isLoading = contextLoading || isSaving;

    return (
        <>
            <Helmet>
                <title>Configuração Asaas - Admin</title>
            </Helmet>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Configuração do Asaas</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard /> Configuração do Asaas
                        </CardTitle>
                        <CardDescription>Insira sua chave de API para habilitar pagamentos com Asaas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="asaas-api-key">Chave de API de Produção</Label>
                            <Input
                                id="asaas-api-key"
                                type="password"
                                placeholder="prod_xxxxxxxxxx"
                                value={asaasApiKey}
                                onChange={(e) => setAsaasApiKey(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <a href="https://www.asaas.com/login" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                            <LinkIcon className="mr-1 h-4 w-4" />
                            Painel do Asaas
                        </a>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Chave Asaas
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default AdminAsaasSettings;
  