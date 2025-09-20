import React, { useState } from 'react';
    import { useCategories } from '@/hooks/useCategories';
    import { useCities } from '@/hooks/useCities';
    import { useFacilities } from '@/hooks/useFacilities';
    import { usePaymentMethods } from '@/hooks/usePaymentMethods';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { MapPin, Phone, Mail, Globe, Heart, Share2 } from 'lucide-react';
    import MapboxMap from '@/components/site/MapboxMap';
    import OpeningHoursStatus from '@/components/site/OpeningHoursStatus';
    import SocialMediaIcons from '@/components/site/SocialMediaIcons';
    import ContactButtons from '@/components/site/ContactButtons';
    import StarRating from '@/components/site/StarRating';
    import ReviewList from '@/components/site/ReviewList';
    import ReviewForm from '@/components/site/ReviewForm';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const IntermediatePlanLayout = ({ ad, reviews, averageRating, onReviewUpdate }) => {
        const { user } = useAuth();
        const { getCategoryById } = useCategories();
        const { getCityById } = useCities();
        const { facilities, getFacilityIcon } = useFacilities();
        const { paymentMethods } = usePaymentMethods();
        const { toast } = useToast();
        const [activeTab, setActiveTab] = useState('overview');
        const [isEditingReview, setIsEditingReview] = useState(false);

        const category = getCategoryById(ad.category_id);
        const city = getCityById(ad.city_id);
        const adFacilities = facilities.filter(f => ad.listing_facilities?.some(lf => lf.facility_id === f.id));
        const adPaymentMethods = paymentMethods.filter(pm => ad.listing_payment_methods?.some(lpm => lpm.payment_method_id === pm.id));

        const mainImage = ad.images && ad.images.length > 0
            ? ad.images[0]
            : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1170&q=80';

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

        return (
            <div className="bg-background text-foreground">
                <div className="relative h-72 md:h-96 bg-gray-900 text-white">
                    <img src={mainImage} alt={`Imagem de ${ad.title}`} className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 container mx-auto">
                        {category && <Badge variant="secondary" className="mb-2">{category.name}</Badge>}
                        <h1 className="text-3xl md:text-5xl font-bold">{ad.title}</h1>
                        {(ad.street || ad.number || ad.neighborhood || city) && (
                            <div className="flex items-center mt-2">
                                <MapPin className="w-5 h-5 mr-2" />
                                <span>{fullAddress}</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2">
                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => handleFeatureNotImplemented('Favoritos')}>
                            <Heart className="w-4 h-4 mr-2" /> Salvar
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => handleFeatureNotImplemented('Compartilhamento')}>
                            <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                        </Button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 md:py-12">
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
                                </div>
                            )}

                            {activeTab === 'gallery' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(ad.images || []).map((imgUrl, index) => (
                                        <a key={index} href={imgUrl} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg group">
                                            <img src={imgUrl} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110" />
                                        </a>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'location' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-4">Localização</h2>
                                    <Card>
                                        <CardContent className="p-0 h-96">
                                            <MapboxMap latitude={Number(ad.latitude)} longitude={Number(ad.longitude)} />
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
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 lg:sticky lg:top-24 self-start">
                            <ContactButtons ad={ad} />
                            <Card>
                                <CardHeader><CardTitle>Informações de Contato</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {ad.phone && <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary flex-shrink-0" /><span className="text-muted-foreground">{ad.phone}</span></div>}
                                    {ad.email && <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary flex-shrink-0" /><a href={`mailto:${ad.email}`} className="text-muted-foreground hover:text-primary break-all">{ad.email}</a></div>}
                                    {ad.website && <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-primary flex-shrink-0" /><a href={ad.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary break-all">{ad.website}</a></div>}
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

    export default IntermediatePlanLayout;