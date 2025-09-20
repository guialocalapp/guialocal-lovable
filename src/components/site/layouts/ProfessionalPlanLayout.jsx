import React, { useState } from 'react';
    import { useCategories } from '@/hooks/useCategories';
    import { useCities } from '@/hooks/useCities';
    import { useFacilities } from '@/hooks/useFacilities';
    import { usePaymentMethods } from '@/hooks/usePaymentMethods';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { MapPin, Heart, Share2, Grid3x3 } from 'lucide-react';
    import MapboxMap from '@/components/site/MapboxMap';
    import ImageLightbox from '@/components/site/ImageLightbox';
    import { AnimatePresence } from 'framer-motion';
    import OpeningHoursStatus from '@/components/site/OpeningHoursStatus';
    import SocialMediaIcons from '@/components/site/SocialMediaIcons';
    import ContactButtons from '@/components/site/ContactButtons';
    import StarRating from '@/components/site/StarRating';
    import ReviewList from '@/components/site/ReviewList';
    import ReviewForm from '@/components/site/ReviewForm';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import ContactInfo from '@/components/site/ContactInfo';

    const ProfessionalPlanLayout = ({ ad, reviews, averageRating, onReviewUpdate }) => {
        const { user } = useAuth();
        const { getCategoryById } = useCategories();
        const { getCityById } = useCities();
        const { facilities, getFacilityIcon } = useFacilities();
        const { paymentMethods } = usePaymentMethods();
        const { toast } = useToast();
        const [activeTab, setActiveTab] = useState('overview');
        const [lightboxOpen, setLightboxOpen] = useState(false);
        const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
        const [isEditingReview, setIsEditingReview] = useState(false);

        const category = ad.categories?.[0] ? getCategoryById(ad.categories[0]) : null;
        const city = getCityById(ad.city_id);
        const adFacilities = facilities.filter(f => ad.listing_facilities?.some(lf => lf.facility_id === f.id));
        const adPaymentMethods = paymentMethods.filter(pm => ad.listing_payment_methods?.some(lpm => lpm.payment_method_id === pm.id));

        const images = ad.images && ad.images.length > 0 
            ? ad.images 
            : Array(5).fill('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1170&q=80');
        
        const galleryImages = images.slice(0, 5);

        const openLightbox = (index) => {
            setLightboxStartIndex(index);
            setLightboxOpen(true);
        };

        const fullAddress = [
            `${ad.street || ''}${ad.number ? `, ${ad.number}` : ''}`,
            ad.neighborhood,
            `${city?.name || ''}${city?.state ? ` - ${city.state}` : ''}`
        ].filter(Boolean).join(' - ');

        const handleFeatureNotImplemented = (feature = "Esta funcionalidade") => {
            toast({
                title: "Em breve! 🚧",
                description: `${feature} ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no próximo prompt! 🚀`,
            });
        };

        const userReview = user ? reviews.find(r => r.user_id === user.id) : null;

        const ImageComponent = ({ src, alt, index, className }) => (
            <div className={`relative overflow-hidden cursor-pointer group ${className}`} onClick={() => openLightbox(index)}>
                <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
        );

        return (
            <div className="bg-background text-foreground">
                <AnimatePresence>
                    {lightboxOpen && (
                        <ImageLightbox
                            images={images}
                            startIndex={lightboxStartIndex}
                            onClose={() => setLightboxOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <div className="container mx-auto px-4 pt-8">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-6">
                           {ad.logo && (
                                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-md border-2 border-border">
                                    <img src={ad.logo} alt={`Logotipo de ${ad.title}`} className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div>
                                {category && <Badge variant="secondary" className="mb-2 w-fit">{category.name}</Badge>}
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{ad.title}</h1>
                                {(ad.street || ad.number || ad.neighborhood || city) && (
                                    <div className="flex items-center text-muted-foreground mb-4">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>{fullAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                         <div className="flex items-center gap-4 flex-shrink-0 pt-2">
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <StarRating rating={averageRating} readOnly />
                                    <span className="ml-2 text-sm font-medium">({reviews.length} {reviews.length === 1 ? 'Avaliação' : 'Avaliações'})</span>
                                </div>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleFeatureNotImplemented('Favoritos')}>
                                <Heart className="w-4 h-4 mr-2" /> Salvar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleFeatureNotImplemented('Compartilhamento')}>
                                <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                            </Button>
                        </div>
                    </div>
                    
                    <div className="relative h-[500px] grid grid-cols-2 grid-rows-2 gap-2 rounded-xl overflow-hidden mb-8">
                        {galleryImages.length > 0 && <ImageComponent src={galleryImages[0]} alt="Imagem principal" index={0} className="col-span-1 row-span-2" />}
                        {galleryImages.length > 1 && <ImageComponent src={galleryImages[1]} alt="Imagem 2" index={1} className="col-span-1 row-span-1" />}
                        {galleryImages.length > 2 && <ImageComponent src={galleryImages[2]} alt="Imagem 3" index={2} className="col-span-1 row-span-1" />}
                        
                        <Button 
                            variant="secondary" 
                            className="absolute bottom-4 right-4 z-10" 
                            onClick={() => openLightbox(0)}>
                            <Grid3x3 className="w-4 h-4 mr-2" />
                            Mostrar todas as fotos ({images.length})
                        </Button>
                    </div>
                </div>

                <div className="container mx-auto px-4 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="border-b border-border mb-8">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                                        Visão Geral
                                    </button>
                                    <button onClick={() => setActiveTab('gallery')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'gallery' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                                        Galeria
                                    </button>
                                    <button onClick={() => setActiveTab('location')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'location' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                                        Localização
                                    </button>
                                    <button onClick={() => setActiveTab('reviews')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}>
                                        Avaliações
                                    </button>
                                </nav>
                            </div>

                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {ad.description && <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">{ad.description}</p>}
                                    
                                    {adFacilities.length > 0 && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground mb-4">Características</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {adFacilities.map((facility) => {
                                                    const Icon = getFacilityIcon(facility.icon);
                                                    return (
                                                        <div key={facility.id} className="flex items-center gap-3 text-muted-foreground">
                                                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                                                            <span>{facility.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {ad.youtube_video_url && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground mb-4">Vídeo</h2>
                                            <div className="aspect-w-16 aspect-h-9">
                                                <iframe 
                                                    src={`https://www.youtube.com/embed/${new URL(ad.youtube_video_url).searchParams.get('v')}`} 
                                                    frameBorder="0" 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen 
                                                    className="w-full h-full rounded-lg"
                                                    title="Vídeo do YouTube"
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'gallery' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {images.map((imgUrl, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg group cursor-pointer" onClick={() => openLightbox(index)}>
                                            <img src={imgUrl} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'location' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Localização</h2>
                                    <Card>
                                        <CardContent className="p-0 h-96">
                                            <MapboxMap latitude={Number(ad.latitude)} longitude={Number(ad.longitude)} adTitle={ad.title} />
                                        </CardContent>
                                    </Card>
                                    <p className="mt-4 text-muted-foreground">{fullAddress}</p>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Avaliações</h2>
                                    {reviews.length > 0 && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <StarRating rating={averageRating} readOnly />
                                            <span className="font-semibold">{averageRating.toFixed(1)}</span>
                                            <span className="text-muted-foreground">({reviews.length} {reviews.length === 1 ? 'Avaliação' : 'Avaliações'})</span>
                                        </div>
                                    )}
                                    <ReviewList reviews={reviews} />
                                    {(isEditingReview || !userReview) && (
                                        <ReviewForm 
                                            listingId={ad.id} 
                                            onReviewSubmit={() => { onReviewUpdate(); setIsEditingReview(false); }}
                                            existingReview={isEditingReview ? userReview : null}
                                            onCancelEdit={() => setIsEditingReview(false)}
                                        />
                                    )}
                                    {userReview && !isEditingReview && (
                                        <Button className="mt-4" onClick={() => setIsEditingReview(true)}>Editar sua avaliação</Button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 lg:sticky lg:top-24 self-start">
                            <Card>
                                <CardHeader><CardTitle>Informações de Contato</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <ContactInfo ad={ad} />
                                    <ContactButtons ad={ad} />
                                    <SocialMediaIcons ad={ad} />
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader><CardTitle>Horário de Funcionamento</CardTitle></CardHeader>
                                <CardContent>
                                    <OpeningHoursStatus openingHours={ad.opening_hours} />
                                </CardContent>
                            </Card>

                            {adPaymentMethods.length > 0 && (
                                <Card>
                                    <CardHeader><CardTitle>Formas de Pagamento</CardTitle></CardHeader>
                                    <CardContent className="flex flex-wrap gap-2">
                                        {adPaymentMethods.map((pm) => (
                                            <Badge key={pm.id} variant="secondary">{pm.name}</Badge>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default ProfessionalPlanLayout;