import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useCities } from '@/hooks/useCities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import MapboxMap from '@/components/site/MapboxMap';
import OpeningHoursStatus from '@/components/site/OpeningHoursStatus';
import ContactButtons from '@/components/site/ContactButtons';
import ContactInfo from '@/components/site/ContactInfo';
import SocialMediaIcons from '@/components/site/SocialMediaIcons';
import StarRating from '@/components/site/StarRating';
import ReviewList from '@/components/site/ReviewList';
import ReviewForm from '@/components/site/ReviewForm';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const FreePlanLayout = ({ ad, reviews, averageRating, onReviewUpdate }) => {
    const { getCategoryById } = useCategories();
    const { getCityById } = useCities();
    const { user } = useAuth();

    const category = ad.categories?.[0] ? getCategoryById(ad.categories[0]) : null;
    const city = getCityById(ad.city_id);

    const [isEditingReview, setIsEditingReview] = useState(null);

    const userReview = reviews.find(review => review.user && user && review.user.id === user.id);

    const handleEditReview = () => {
        setIsEditingReview(userReview);
    };

    const handleCancelEdit = () => {
        setIsEditingReview(null);
    };

    const handleReviewSubmitted = () => {
        setIsEditingReview(null);
        if (onReviewUpdate) {
            onReviewUpdate();
        }
    };
    
    const fullAddress = [
        `${ad.street || ''}${ad.number ? `, ${ad.number}` : ''}`,
        ad.neighborhood,
        `${city?.name || ''}${city?.state ? ` - ${city.state}` : ''}`
    ].filter(Boolean).join(' - ');

    const hasReviews = reviews && reviews.length > 0;
    const mainImage = ad.images?.[0];

    const ImageComponent = () => (
        mainImage && (
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <img 
                        src={mainImage}
                        alt={`Imagem principal de ${ad.title}`}
                        className="w-full h-auto object-cover aspect-video"
                     />
                </CardContent>
            </Card>
        )
    );

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="mb-6">
                    {category && (
                        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-4">
                            {category.name}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{ad.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-4">
                        {(ad.street || ad.number || ad.neighborhood || city) && (
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{fullAddress}</span>
                            </div>
                        )}
                        {hasReviews && (
                             <div className="flex items-center">
                                <StarRating rating={averageRating} size={4} />
                                <span className="ml-2 text-sm">({reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'})</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="lg:hidden">
                            <ImageComponent />
                        </div>
                        {ad.description && (
                            <Card>
                                <CardHeader><CardTitle>Sobre</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">{ad.description}</p>
                                </CardContent>
                            </Card>
                        )}
                        {ad.opening_hours && Object.keys(ad.opening_hours).length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Horário de Funcionamento</CardTitle></CardHeader>
                                <CardContent>
                                    <OpeningHoursStatus openingHours={ad.opening_hours} />
                                </CardContent>
                            </Card>
                        )}

                        <div id="avaliacoes" className="space-y-8 scroll-mt-24">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Avaliações ({reviews.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ReviewList reviews={reviews} />
                                </CardContent>
                            </Card>

                            {userReview && !isEditingReview && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sua Avaliação</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <StarRating rating={userReview.rating} className="my-1" />
                                                <p className="text-muted-foreground">{userReview.comment}</p>
                                            </div>
                                        </div>
                                        <Button onClick={handleEditReview}>Editar Avaliação</Button>
                                    </CardContent>
                                </Card>
                            )}

                            {(!userReview || isEditingReview) && (
                                <ReviewForm 
                                    listingId={ad.id} 
                                    onReviewSubmit={handleReviewSubmitted} 
                                    existingReview={isEditingReview}
                                    onCancelEdit={handleCancelEdit}
                                />
                            )}
                        </div>
                    </div>
                    <div className="space-y-6 lg:sticky lg:top-24 self-start">
                        <div className="hidden lg:block">
                            <ImageComponent />
                        </div>
                        <Card>
                            <CardHeader><CardTitle>Contato</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <ContactInfo ad={ad} />
                                <ContactButtons ad={ad} />
                                <SocialMediaIcons ad={ad} />
                            </CardContent>
                        </Card>
                        
                        {(ad.latitude && ad.longitude) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Localização</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 h-64">
                                    <MapboxMap latitude={Number(ad.latitude)} longitude={Number(ad.longitude)} adTitle={ad.title} />
                                </CardContent>
                            </Card>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreePlanLayout;