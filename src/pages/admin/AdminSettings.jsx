import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { useSettings } from '@/contexts/SettingsContext';
    import { Loader2 } from 'lucide-react';

    const AdminSettings = () => {
        const { settings, loading, updateSettings } = useSettings();
        const [toastDuration, setToastDuration] = useState(5);

        useEffect(() => {
            if (settings.general?.toastDuration) {
                setToastDuration(settings.general.toastDuration / 1000);
            }
        }, [settings.general]);

        const handleSubmit = (e) => {
            e.preventDefault();
            const durationInMs = Number(toastDuration) * 1000;
            updateSettings('general', { toastDuration: durationInMs });
        };

        return (
            <>
                <Helmet>
                    <title>Configurações - Admin - Guia Local</title>
                </Helmet>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Configurações Gerais</h2>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Notificações</CardTitle>
                            <CardDescription>Ajuste as configurações de notificação da plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="toast-duration">Duração da Notificação (segundos)</Label>
                                    <Input
                                        id="toast-duration"
                                        type="number"
                                        value={toastDuration}
                                        onChange={(e) => setToastDuration(e.target.value)}
                                        min="1"
                                        step="1"
                                        className="w-full md:w-1/3"
                                        disabled={loading}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Tempo que as notificações (toasts) permanecem na tela.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </>
        );
    };

    export default AdminSettings;