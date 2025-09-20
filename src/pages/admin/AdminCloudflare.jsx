import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { useSettings } from '@/contexts/SettingsContext';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Loader2 } from 'lucide-react';
    import { Switch } from '@/components/ui/switch';

    const AdminCloudflare = () => {
        const { settings, loading, updateSettings, fetchAllSettings } = useSettings();
        const [siteKey, setSiteKey] = useState('');
        const [secretKey, setSecretKey] = useState('');
        const [enabled, setEnabled] = useState(false);

        useEffect(() => {
            if (settings.cloudflare) {
                setSiteKey(settings.cloudflare.siteKey || '');
                setSecretKey(settings.cloudflare.secretKey || '');
                setEnabled(settings.cloudflare.enabled || false);
            }
        }, [settings.cloudflare]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            const cloudflareSettings = { siteKey, enabled };
            if (secretKey && secretKey !== '********') {
                cloudflareSettings.secretKey = secretKey;
            }
            await updateSettings('cloudflare', cloudflareSettings);
        };

        return (
            <>
                <Helmet>
                    <title>Cloudflare Turnstile - Admin</title>
                </Helmet>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">Cloudflare Turnstile</h2>
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuração do Turnstile</CardTitle>
                                <CardDescription>
                                    Insira suas chaves do Cloudflare Turnstile para proteger os formulários de login e registro contra bots.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="cloudflare-enabled"
                                        checked={enabled}
                                        onCheckedChange={setEnabled}
                                        disabled={loading}
                                    />
                                    <Label htmlFor="cloudflare-enabled">Ativar Turnstile</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siteKey">Site Key</Label>
                                    <Input
                                        id="siteKey"
                                        value={siteKey}
                                        onChange={(e) => setSiteKey(e.target.value)}
                                        placeholder="Sua Site Key do Turnstile"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="secretKey">Secret Key</Label>
                                    <Input
                                        id="secretKey"
                                        type="password"
                                        value={secretKey}
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        placeholder="Deixe em branco para não alterar"
                                        disabled={loading}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </>
        );
    };

    export default AdminCloudflare;