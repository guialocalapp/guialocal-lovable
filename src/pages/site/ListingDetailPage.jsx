import React, { useState, useEffect, useMemo, useCallback } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { useParams, Navigate } from 'react-router-dom';
    import { supabase } from '@/lib/customSupabaseClient';
    import { fetchAdByIdApi } from '@/services/adService';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    
    import { useUsers } from '@/hooks/useUsers';
    import { usePlans } from '@/hooks/usePlans';
    
    import DefaultAdLayout from '@/components/site/layouts/DefaultAdLayout';
    import FreePlanLayout from '@/components/site/layouts/FreePlanLayout';
    import IntermediatePlanLayout from '@/components/site/layouts/IntermediatePlanLayout';
    import ProfessionalPlanLayout from '@/components/site/layouts/ProfessionalPlanLayout';
    import PremiumPlanLayout from '@/components/site/layouts/PremiumPlanLayout';

    const ListingDetailPage = () => {
        const { anuncioSlug } = useParams();
        const { user } = useAuth();
        const { getUserById, loading: usersLoading } = useUsers();
        const { getPlanById, loading: plansLoading } = usePlans();
        
        const [ad, setAd] = useState(null);
        const [allReviews, setAllReviews] = useState([]);
        const [client, setClient] = useState(null);
        const [plan, setPlan] = useState(null);
        const [loading, setLoading] = useState(true);
        const [isInvalid, setIsInvalid] = useState(false);

        const fetchReviewsForAd = useCallback(async (listingId) => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, user:profiles(full_name, id)')
                .eq('listing_id', listingId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching reviews:", error);
            } else {
                setAllReviews(data);
            }
        }, []);

        useEffect(() => {
            const fetchAd = async () => {
                setLoading(true);
                
                const { data: adData, error } = await supabase
                    .from('listings')
                    .select('*, listing_statuses(name)')
                    .eq('slug', anuncioSlug)
                    .single();

                if (error || !adData || adData.listing_statuses?.name !== 'Ativo') {
                    setIsInvalid(true);
                    setLoading(false);
                    return;
                }

                const fullAdData = await fetchAdByIdApi(adData.id);
                if (!fullAdData) {
                    setIsInvalid(true);
                    setLoading(false);
                    return;
                }

                setAd(fullAdData);
                await fetchReviewsForAd(fullAdData.id);
                
                const clientData = getUserById(fullAdData.user_id);
                if (clientData) {
                    setClient(clientData);
                    const planData = getPlanById(clientData.plan_id);
                    setPlan(planData);
                }

                const incrementView = async () => {
                    const { error } = await supabase.rpc('increment_listing_view', { listing_id_param: fullAdData.id });
                    if (error) {
                        console.error("Error incrementing view count:", error);
                    }
                };
                incrementView();
                
                setLoading(false);
            };

            if (!usersLoading && !plansLoading) {
                fetchAd();
            }

        }, [anuncioSlug, getUserById, getPlanById, usersLoading, plansLoading, fetchReviewsForAd]);
        
        const approvedReviews = useMemo(() => allReviews.filter(r => r.status === 'Aprovado'), [allReviews]);
        
        const averageRating = useMemo(() => {
            if (approvedReviews.length === 0) return 0;
            const total = approvedReviews.reduce((acc, review) => acc + review.rating, 0);
            return total / approvedReviews.length;
        }, [approvedReviews]);

        const handleReviewUpdate = useCallback(async () => {
            if (ad) {
                await fetchReviewsForAd(ad.id);
            }
        }, [ad, fetchReviewsForAd]);

        if (loading) {
            return <div className="container mx-auto text-center py-20">Carregando...</div>;
        }

        if (isInvalid || !ad) {
            return <Navigate to="/404" replace />;
        }
        
        const adProps = { 
            ad, 
            client, 
            plan, 
            reviews: approvedReviews, 
            averageRating,
            onReviewUpdate: handleReviewUpdate
        };

        const renderLayout = () => {
            const planName = plan?.name?.toLowerCase();
            switch (planName) {
                case 'plano gratuito':
                    return <FreePlanLayout {...adProps} />;
                case 'plano intermediário':
                    return <IntermediatePlanLayout {...adProps} />;
                case 'plano profissional':
                    return <ProfessionalPlanLayout {...adProps} />;
                case 'plano premium':
                    return <PremiumPlanLayout {...adProps} />;
                default:
                    return <DefaultAdLayout {...adProps} />;
            }
        };

        return (
            <>
                <Helmet>
                    <title>{ad.title} - Guia Local</title>
                    <meta name="description" content={ad.description?.substring(0, 160)} />
                </Helmet>
                {renderLayout()}
            </>
        );
    };

    export default ListingDetailPage;