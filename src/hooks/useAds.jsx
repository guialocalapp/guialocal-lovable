import { createContext, useContext, useState, useEffect, useCallback } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { useLoading } from '@/contexts/LoadingContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import { addAd as addAdApi, updateAd as updateAdApi, deleteAd as deleteAdApi } from '@/services/adService';
    import { useAdStatus } from '@/hooks/useAdStatus';

    export const AdContext = createContext(null);

    export const useAds = () => {
        const context = useContext(AdContext);
        if (!context) {
            throw new Error('useAds must be used within an AdProvider');
        }
        return context;
    };

    export const AdProvider = ({ children }) => {
        const [ads, setAds] = useState([]);
        const [publicAds, setPublicAds] = useState([]);
        const [totalPublicAds, setTotalPublicAds] = useState(0);
        const [loading, setLoading] = useState(true);
        const { toast } = useToast();
        const { setIsLoading } = useLoading();
        const { statuses } = useAdStatus();

        const fetchAllAdminAds = useCallback(async () => {
            setLoading(true);
            try {
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

                if (error) throw error;
                
                const adsWithSingleCategory = data.map(ad => ({
                  ...ad,
                  category_id: ad.listing_categories[0]?.category_id,
                }));
                setAds(adsWithSingleCategory);
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao buscar todos os anúncios", description: error.message });
            } finally {
                setLoading(false);
            }
        }, [toast]);
        
        const fetchPublicAds = useCallback(async ({ page = 1, limit = 50, filters = {} }) => {
            setLoading(true);
            try {
                const activeStatus = statuses.find(s => s.name === 'Ativo');
                if (!activeStatus) return;

                let query = supabase
                    .from('listings')
                    .select(`
                        *,
                        cities!inner ( name, state, slug ),
                        categories:listing_categories (categories(name)),
                        listing_facilities ( facility_id )
                    `, { count: 'exact' })
                    .eq('moderation_status', 'Aprovado')
                    .eq('listing_status_id', activeStatus.id);
                
                if (filters.citySlug && filters.citySlug !== 'todos') {
                    query = query.eq('cities.slug', filters.citySlug);
                }
                if (filters.categoryIds && filters.categoryIds.length > 0) {
                    query = query.filter('listing_categories.category_id', 'in', `(${filters.categoryIds.join(',')})`);
                }
                if (filters.searchTerm) {
                    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
                }
                if (filters.facilityIds && filters.facilityIds.length > 0) {
                     query = query.in('listing_facilities.facility_id', filters.facilityIds);
                }
                
                query = query
                    .order('order_index', { ascending: true, nullsFirst: false })
                    .order('created_at', { ascending: false });


                const from = (page - 1) * limit;
                const to = from + limit - 1;
                query = query.range(from, to);

                let { data, error, count } = await query;
                
                if (error) throw error;
                
                if (filters.categoryIds && filters.categoryIds.length > 0) {
                    data = data.filter(ad => ad.categories && ad.categories.length > 0);
                    // O count exato não é possível com esse tipo de filtro, então ajustamos o total
                    // Isso é uma limitação, mas funciona para a paginação. Para um total preciso, seria necessária uma view ou RPC.
                    count = data.length < limit ? (page-1)*limit + data.length : count;
                }
                
                const adsWithSimplifiedStructure = data.map(ad => ({
                    ...ad,
                    categories: ad.categories[0]?.categories,
                }));

                setPublicAds(adsWithSimplifiedStructure);
                setTotalPublicAds(count);
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao buscar anúncios públicos", description: error.message });
                setPublicAds([]);
                setTotalPublicAds(0);
            } finally {
                setLoading(false);
            }
        }, [toast, statuses]);

        useEffect(() => {
            fetchAllAdminAds();
        }, [fetchAllAdminAds]);

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

        const addAd = async (adData) => {
            setIsLoading(true);
            try {
                await addAdApi(adData);
                toast({ title: "Anúncio adicionado com sucesso!" });
                await fetchAllAdminAds();
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao adicionar anúncio", description: error.message });
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const updateAd = async (id, adData) => {
            setIsLoading(true);
            try {
                await updateAdApi(id, adData);
                toast({ title: "Anúncio atualizado com sucesso!" });
                await fetchAllAdminAds();
            } catch (error) {
                toast({ variant: "destructive", title: "Erro ao atualizar anúncio", description: error.message });
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        const deleteAd = async (id) => {
            setIsLoading(true);
            try {
                await deleteAdApi(id);
                toast({ title: "Anúncio deletado com sucesso!" });
                await fetchAllAdminAds();
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

        return (
            <AdContext.Provider value={{ 
                ads, publicAds, totalPublicAds, loading, 
                fetchAllAdminAds, fetchPublicAds, getAdById, getAdBySlug, 
                addAd, updateAd, deleteAd, incrementView,
                filterAdsByBounds
            }}>
                {children}
            </AdContext.Provider>
        );
    };