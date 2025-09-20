import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';

const AdminEmail = () => {
    const { settings, loading, updateSettings } = useSettings();
    const [formData, setFormData] = useState({
        fromEmail: '',
        host: '',
        port: '',
        user: '',
        pass: ''
    });
    const { toast } = useToast();

    useEffect(() => {
        if (settings.smtp) {
            setFormData({
                fromEmail: settings.smtp.fromEmail || 'Guia Local <onboarding@resend.dev>',
                host: settings.smtp.host || '',
                port: settings.smtp.port || '',
                user: settings.smtp.user || '',
                pass: '********' 
            });
        } else {
             setFormData(prev => ({ ...prev, fromEmail: 'Guia Local <onboarding@resend.dev>' }));
        }
    }, [settings.smtp]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let settingsToSave = { ...formData };
        
        if (formData.pass === '********') {
            const { pass, ...rest } = formData;
            settingsToSave = rest;
        }

        await updateSettings('smtp', settingsToSave);
    };

    return (
        <>
            <Helmet>
                <title>Configurações de Email - Admin - Guia Local</title>
            </Helmet>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Configurações de Email</h2>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Configuração de Envio</CardTitle>
                        <CardDescription>
                            Configure os dados para o envio de emails transacionais. Atualmente, o sistema está usando a API da Resend.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="fromEmail">E-mail do Remetente</Label>
                           <Input id="fromEmail" value={formData.fromEmail} onChange={handleChange} placeholder="Nome <email@dominio.com>" disabled={loading} />
                           <p className="text-sm text-muted-foreground">
                            Use um e-mail de um domínio verificado na Resend. Ex: <strong>Guia Local &lt;contato@guialocal.app&gt;</strong>
                           </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : <><Save className="mr-2 h-4 w-4" /> Salvar Configurações</>}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </>
    );
};

export default AdminEmail;