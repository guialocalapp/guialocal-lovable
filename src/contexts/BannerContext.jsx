import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';

    export const BannerContext = createContext();

    export const BannerProvider = ({ children }) => {
        const [banners, setBanners] = useState([]);
        const [loading, setLoading] = useState(true);
        const { toast } = useToast();

        const fetchBanners = useCallback(async () => {
            setLoading(true);
            const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
            if (error) {
                toast({ variant: "destructive", title: "Erro ao buscar banners", description: error.message });
            } else {
                setBanners(data);
            }
            setLoading(false);
        }, [toast]);

        useEffect(() => {
            fetchBanners();
        }, [fetchBanners]);

        const activeHomeTopBanners = useMemo(() => {
            return banners.filter(banner => banner.location === 'home_top' && banner.status === 'ativo');
        }, [banners]);

        const addBanner = async (bannerData) => {
            const { data, error } = await supabase.from('banners').insert([bannerData]).select();
            if (error) {
                toast({ variant: "destructive", title: "Erro ao adicionar banner", description: error.message });
                return null;
            }
            toast({ title: "Banner adicionado com sucesso!" });
            await fetchBanners();
            return data[0];
        };

        const updateBanner = async (id, bannerData) => {
            const { created_at, ...updateData } = bannerData;
            const { data, error } = await supabase.from('banners').update(updateData).eq('id', id).select();
            if (error) {
                toast({ variant: "destructive", title: "Erro ao atualizar banner", description: error.message });
                return null;
            }
            toast({ title: "Banner atualizado com sucesso!" });
            await fetchBanners();
            return data[0];
        };

        const deleteBanner = async (id) => {
            const { error } = await supabase.from('banners').delete().eq('id', id);
            if (error) {
                toast({ variant: "destructive", title: "Erro ao deletar banner", description: error.message });
                return false;
            }
            toast({ title: "Banner deletado com sucesso!" });
            await fetchBanners();
            return true;
        };

        const getBannerById = useCallback((id) => {
            return banners.find(b => b.id === id);
        }, [banners]);

        return (
            <BannerContext.Provider value={{ banners, loading, activeHomeTopBanners, addBanner, updateBanner, deleteBanner, getBannerById, fetchBanners }}>
                {children}
            </BannerContext.Provider>
        );
    };