import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/hooks/useAuth';
    import { useLoading } from '@/contexts/LoadingContext';
    import { useAdStatus } from '@/hooks/useAdStatus';
    import { supabase } from '@/lib/customSupabaseClient';
    import { addAd as addAdApi, updateAd as updateAdApi, deleteAd as deleteAdApi } from '@/services/adService';

    export const AdContext = createContext();

    export const AdProvider = ({ children }) => {
        const [ads, setAds] = useState([]);
        const [loading, setLoading] = useState(true);
        const { toast } = useToast();
        const { user } = useAuth();
        const { setIsLoading } = useLoading();
        const { statuses } = useAdStatus();

        const fetchAds = useCallback(async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('listings')
                .select(`
                    *,
                    profiles:user_id (full_name, email, plan:plan_id ( name )),
                    cities ( name, state ),
                    listing_statuses ( name ),
                    listing_categories(category_id),
                    listing_facilities(facility_id),
                    listing_payment_methods(payment_method_id)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                toast({ variant: "destructive", title: "Erro ao buscar anúncios", description: error.message });
            } else {
                const adsWithSingleCategory = data.map(ad => ({
                  ...ad,
                  category_id: ad.listing_categories[0]?.category_id,
                }));
                setAds(adsWithSingleCategory);
            }
            setLoading(false);
        }, [toast]);

        useEffect(() => {
            fetchAds();
        }, [fetchAds]);
        
        const publicAds = useMemo(() => {
            const activeStatus = statuses.find(s => s.name === 'Ativo');
            if (!activeStatus) return [];
            return ads.filter(ad => ad.listing_status_id === activeStatus.id && ad.moderation_status === 'Aprovado');
        }, [ads, statuses]);
        
        const filterAdsByBounds = useCallback((adsToFilter, bounds) => {
            if (!bounds) return adsToFilter;
            return adsToFilter.filter(ad => 
                ad.latitude && ad.longitude &&
                ad.longitude >= bounds.getWest() &&
                ad.longitude <= bounds.getEast() &&
                ad.latitude >= bounds.getSouth() &&
                ad.latitude <= bounds.getNorth()
            );
        }, []);

        const getAdById = useCallback((id) => {
            return ads.find(ad => ad.id === id);
        }, [ads]);

        const getAdBySlug = useCallback(async (slug) => {
            const { data, error } = await supabase
                .from('listings')
                .select(`
                    *,
                    opening_hours,
                    cities(name, state, slug),
                    listing_categories(category_id),
                    listing_facilities(facility_id),
                    listing_payment_methods(payment_method_id)
                `)
                .eq('slug', slug)
                .single();

            if (error) {
                console.error('Error fetching ad by slug', error);
                return null;
            }

            return { ...data, category_id: data.listing_categories[0]?.category_id };
        }, []);
        

        const handleAddAd = async (adData) => {
            setIsLoading(true);
            try {
                await addAdApi(adData);
                toast({ title: "Anúncio adicionado com sucesso!" });
                await fetchAds();
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao adicionar anúncio", description: error.message });
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const handleUpdateAd = async (id, adData) => {
            setIsLoading(true);
            try {
                await updateAdApi(id, adData);
                toast({ title: "Anúncio atualizado com sucesso!" });
                await fetchAds();
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao atualizar anúncio", description: error.message });
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const handleDeleteAd = async (id) => {
            setIsLoading(true);
            try {
                await deleteAdApi(id);
                toast({ title: "Anúncio deletado com sucesso!" });
                await fetchAds();
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao deletar anúncio", description: error.message });
            } finally {
                setIsLoading(false);
            }
        };
        
        const incrementView = async (listingId) => {
            try {
                await supabase.rpc('increment_listing_view', { listing_id_param: listingId });
                setAds(prevAds => prevAds.map(ad => 
                    ad.id === listingId ? { ...ad, views: (ad.views || 0) + 1 } : ad
                ));
            } catch (error) {
                console.error('Failed to increment view count:', error);
            }
        };

        return (
            <AdContext.Provider value={{ ads, publicAds, loading, fetchAds, getAdById, getAdBySlug, addAd: handleAddAd, updateAd: handleUpdateAd, deleteAd: handleDeleteAd, incrementView, filterAdsByBounds }}>
                {children}
            </AdContext.Provider>
        );
    };