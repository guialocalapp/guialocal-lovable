import React, { createContext, useState, useEffect, useContext } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/hooks/useAuth';
    import { supabase } from '@/lib/customSupabaseClient';

    export const SettingsContext = createContext();

    export const SettingsProvider = ({ children }) => {
        const [settings, setSettings] = useState({ 
            general: { toastDuration: 5000 },
            cloudflare: { siteKey: '', secretKey: '', enabled: false },
            smtp: { host: '', port: '', user: '', pass: '' }
        });
        const [loading, setLoading] = useState(true);
        const { toast } = useToast();
        const { user } = useAuth();

        const fetchAllSettings = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('settings').select('*');
            if (error) {
                toast({ variant: 'destructive', title: 'Erro ao buscar configurações', description: error.message });
            } else {
                const settingsMap = data.reduce((acc, setting) => {
                    acc[setting.id] = setting.value;
                    return acc;
                }, {});
                setSettings(prev => ({...prev, ...settingsMap}));
            }
            setLoading(false);
        };

        useEffect(() => {
            if(user?.profile?.role === 'admin') {
                fetchAllSettings();
            } else {
                setLoading(false);
            }
        }, [user]);

        const updateSettings = async (settingsId, newSettings) => {
            setLoading(true);
            const { error } = await supabase.rpc('upsert_setting', { p_id: settingsId, p_value: newSettings });
            if (error) {
                toast({
                    variant: 'destructive',
                    title: `Erro ao salvar ${settingsId}`,
                    description: error.message,
                });
            } else {
                toast({ title: `${settingsId} salvo com sucesso!` });
                setSettings(prev => ({ ...prev, [settingsId]: newSettings }));
            }
            setLoading(false);
        };

        const getPublicSettings = async () => {
            const { data, error } = await supabase.functions.invoke('get-public-settings');
            if (error) {
                console.error("Error fetching public settings:", error);
                return {};
            }
            return data;
        };

        return (
            <SettingsContext.Provider value={{ settings, loading, updateSettings, fetchAllSettings, getPublicSettings }}>
                {children}
            </SettingsContext.Provider>
        );
    };

    export const useSettings = () => {
        const context = useContext(SettingsContext);
        if (context === undefined) {
            throw new Error('useSettings must be used within a SettingsProvider');
        }
        return context;
    };