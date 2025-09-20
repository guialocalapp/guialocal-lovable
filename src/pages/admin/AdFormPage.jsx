import React, { useState, useEffect, useCallback } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { useParams, useNavigate, Link } from 'react-router-dom';
    import { v4 as uuidv4 } from 'uuid';
    import { supabase } from '@/lib/customSupabaseClient';
    import { compressImage, generateImageFileName, generateUniqueSlug } from '@/lib/utils';

    import { useAds } from '@/hooks/useAds';
    import { useUsers } from '@/hooks/useUsers';
    import { usePlans } from '@/hooks/usePlans';
    import { useAdStatus } from '@/contexts/AdStatusContext';
    import { useLoading } from '@/contexts/LoadingContext';

    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
    import { ArrowLeft } from 'lucide-react';

    import AdFormMainInfo from '@/components/admin/ads/AdFormMainInfo';
    import AdFormContactInfo from '@/components/admin/ads/AdFormContactInfo';
    import AdFormSocials from '@/components/admin/ads/AdFormSocials';
    import AdFormAddressInfo from '@/components/admin/ads/AdFormAddressInfo';
    import AdFormCategories from '@/components/admin/ads/AdFormCategories';
    import AdFormFacilities from '@/components/admin/ads/AdFormFacilities';
    import AdFormPaymentMethods from '@/components/admin/ads/AdFormPaymentMethods';
    import AdFormImageUpload from '@/components/admin/ads/AdFormImageUpload';
    import AdFormLogoUpload from '@/components/admin/ads/AdFormLogoUpload';
    import AdFormOpeningHours from '@/components/admin/ads/AdFormOpeningHours';

    const AdFormPage = () => {
        const { id } = useParams();
        const navigate = useNavigate();
        const { toast } = useToast();
        const { setIsLoading } = useLoading();
        const { addAd, updateAd, getAdById } = useAds();
        const { getUserById } = useUsers();
        const { getPlanById } = usePlans();
        const { statuses } = useAdStatus();

        const isEditing = Boolean(id);
        
        const [formData, setFormData] = useState({
            title: '',
            slug: '',
            description: '',
            observations: '',
            internal_observations: '',
            user_id: '',
            categories: [],
            listing_status_id: '',
            moderation_status: 'Aprovado',
            images: [],
            logo: null,
            facilities: [],
            payment_methods: [],
            website: '',
            phone: '',
            whatsapp: '',
            email: '',
            instagram: '',
            facebook: '',
            youtube: '',
            linkedin: '',
            tiktok: '',
            x_twitter: '',
            pinterest: '',
            kwai: '',
            telegram: '',
            zip_code: '',
            street: '',
            number: '',
            neighborhood: '',
            complement: '',
            city_id: '',
            latitude: null,
            longitude: null,
            views: 0,
            opening_hours: {},
        });

        const [clientPlan, setClientPlan] = useState(null);

        const setFormField = useCallback((field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        }, []);

        const setFormFields = useCallback((fields) => {
            setFormData(prev => ({...prev, ...fields}));
        }, []);

        useEffect(() => {
            const activeStatus = statuses.find(s => s.name.toLowerCase() === 'ativo');
            const initialStatusId = activeStatus ? activeStatus.id : statuses[0]?.id || '';

            if (isEditing && id) {
                const ad = getAdById(id);
                if (ad) {
                    const adData = {
                        title: ad.title || '',
                        slug: ad.slug || '',
                        description: ad.description || '',
                        observations: ad.observations || '',
                        internal_observations: ad.internal_observations || '',
                        user_id: ad.user_id || 'null',
                        categories: ad.listing_categories?.map(c => c.category_id) || [],
                        listing_status_id: ad.listing_status_id || initialStatusId,
                        moderation_status: ad.moderation_status || 'Aprovado',
                        images: ad.images?.map(imgUrl => ({ id: uuidv4(), url: imgUrl, file: null })) || [],
                        logo: ad.logo ? { id: uuidv4(), url: ad.logo, file: null } : null,
                        facilities: ad.listing_facilities?.map(f => f.facility_id) || [],
                        payment_methods: ad.listing_payment_methods?.map(p => p.payment_method_id) || [],
                        website: ad.website || '',
                        phone: ad.phone || '',
                        whatsapp: ad.whatsapp || '',
                        email: ad.email || '',
                        instagram: ad.instagram || '',
                        facebook: ad.facebook || '',
                        youtube: ad.youtube || '',
                        linkedin: ad.linkedin || '',
                        tiktok: ad.tiktok || '',
                        x_twitter: ad.x_twitter || '',
                        pinterest: ad.pinterest || '',
                        kwai: ad.kwai || '',
                        telegram: ad.telegram || '',
                        zip_code: ad.zip_code || '',
                        street: ad.street || '',
                        number: ad.number || '',
                        neighborhood: ad.neighborhood || '',
                        complement: ad.complement || '',
                        city_id: ad.city_id || 'null',
                        latitude: ad.latitude || null,
                        longitude: ad.longitude || null,
                        views: ad.views || 0,
                        opening_hours: ad.opening_hours || {},
                    };
                    setFormData(adData);
                } else {
                    toast({ variant: "destructive", title: "Erro!", description: "Anúncio não encontrado." });
                    navigate('/admin/listings');
                }
            } else {
                setFormData(prev => ({ 
                    ...prev, 
                    listing_status_id: initialStatusId,
                    moderation_status: 'Aprovado',
                    user_id: 'null',
                    categories: [],
                    city_id: 'null',
                    observations: '',
                    internal_observations: '',
                    opening_hours: {},
                }));
            }
        }, [id, isEditing, getAdById, navigate, toast, statuses]);

        useEffect(() => {
            const fetchAndSetClientPlan = (selectedUserId) => {
                if (selectedUserId && selectedUserId !== 'null') {
                    const client = getUserById(selectedUserId);
                    if (client && client.plan_id) {
                        const plan = getPlanById(client.plan_id);
                        setClientPlan(plan);
                    } else {
                        setClientPlan(null);
                    }
                } else {
                    setClientPlan(null);
                }
            };
            fetchAndSetClientPlan(formData.user_id);
        }, [formData.user_id, getUserById, getPlanById]);

        const uploadImage = async (imageFile, adTitle, prefix) => {
            if (!imageFile) return null;
            const compressedFile = await compressImage(imageFile);
            const fileName = generateImageFileName(adTitle, `${prefix}-${compressedFile.name}`);
            const { data, error } = await supabase.storage
                .from('listings_images')
                .upload(fileName, compressedFile, { upsert: true });

            if (error) {
                throw new Error(`Erro no upload da imagem: ${error.message}`);
            }
            
            const { data: { publicUrl } } = supabase.storage.from('listings_images').getPublicUrl(data.path);
            return publicUrl;
        };

        const validateForm = () => {
            const requiredFields = [
                { field: 'title', name: 'Título do Anúncio' },
                { field: 'user_id', name: 'Cliente' },
                { field: 'categories', name: 'Categorias' },
                { field: 'listing_status_id', name: 'Status' },
            ];

            for (const { field, name } of requiredFields) {
                const value = formData[field];
                if (!value || (Array.isArray(value) && value.length === 0) || value === 'null') {
                    toast({
                        variant: "destructive",
                        title: "Campo obrigatório",
                        description: `O campo '${name}' é obrigatório.`,
                    });
                    return false;
                }
            }
            return true;
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }

            setIsLoading(true);
            try {
                let logoUrl = formData.logo?.url || null;
                if (formData.logo && formData.logo.file) {
                    logoUrl = await uploadImage(formData.logo.file, formData.title, 'logo');
                }

                const imageUrls = [];
                for (const image of formData.images) {
                    if (image.file) {
                        const url = await uploadImage(image.file, formData.title, 'gallery');
                        if (url) imageUrls.push(url);
                    } else if (image.url) {
                        imageUrls.push(image.url);
                    }
                }
                
                const dataToSubmit = { 
                    ...formData, 
                    logo: logoUrl,
                    images: imageUrls,
                    user_id: formData.user_id === 'null' ? null : formData.user_id,
                    city_id: formData.city_id === 'null' ? null : formData.city_id,
                };
                
                if (!isEditing) {
                    dataToSubmit.slug = await generateUniqueSlug(formData.title, 'listings');
                }

                if (isEditing) {
                    await updateAd(id, dataToSubmit);
                } else {
                    await addAd(dataToSubmit);
                }
                navigate('/admin/listings');
            } catch (error) {
                toast({ variant: "destructive", title: "Erro!", description: error.message });
            } finally {
                setIsLoading(false);
            }
        };

        const imageLimit = clientPlan?.imageLimit;
        const showLogoUpload = clientPlan && ['Plano Premium', 'Plano Profissional'].includes(clientPlan.name);
        
        return (
            <>
                <Helmet>
                    <title>{isEditing ? 'Editar Anúncio' : 'Novo Anúncio'} - Admin - Guia Local</title>
                </Helmet>

                <div className="mb-4">
                    <Link to="/admin/listings" className="flex items-center text-sm text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Anúncios
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{isEditing ? 'Editar Anúncio' : 'Novo Anúncio'}</CardTitle>
                            <CardDescription>Preencha os detalhes do anúncio abaixo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            
                            <AdFormMainInfo formData={formData} setFormField={setFormField} clientPlan={clientPlan} isEditing={isEditing} />
                            
                            <AdFormContactInfo formData={formData} setFormField={setFormField} />
                            
                            <AdFormSocials formData={formData} setFormField={setFormField} />

                            <AdFormAddressInfo formData={formData} setFormField={setFormField} setFormFields={setFormFields} />

                            <AdFormOpeningHours formData={formData} setFormField={setFormField} />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <AdFormCategories formData={formData} setFormField={setFormField} />
                                <AdFormFacilities formData={formData} setFormField={setFormField} />
                                <AdFormPaymentMethods formData={formData} setFormField={setFormField} />
                            </div>
                            
                            <div className="space-y-8">
                                {showLogoUpload && <AdFormLogoUpload logo={formData.logo} setFormField={setFormField} />}
                                <AdFormImageUpload formData={formData} setFormField={setFormField} imageLimit={imageLimit} />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                             <Button type="button" variant="ghost" onClick={() => navigate('/admin/listings')}>Cancelar</Button>
                             <Button type="submit">Salvar Anúncio</Button>
                        </CardFooter>
                    </Card>
                </form>
            </>
        );
    };

    export default AdFormPage;