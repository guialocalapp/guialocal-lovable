import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import StarRating from './StarRating';

const AdCard = ({ ad }) => {
    const mainImage = ad.images && ad.images.length > 0 ? ad.images[0] : 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1170&q=80';

    const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 });

    useEffect(() => {
        const fetchReviews = async () => {
            if (!ad.id) return;
            const { data, error } = await supabase
                .from('reviews')
                .select('rating')
                .eq('listing_id', ad.id)
                .eq('status', 'Aprovado');
            
            if (error) {
                console.error("Error fetching reviews for ad card:", error);
                return;
            }

            if (data && data.length > 0) {
                const total = data.reduce((acc, curr) => acc + curr.rating, 0);
                const avg = total / data.length;
                setReviewStats({ avg, count: data.length });
            }
        };

        fetchReviews();
    }, [ad.id]);

    const fullAddressParts = [
        ad.street,
        ad.number,
    ];
    const addressPart1 = fullAddressParts.filter(Boolean).join(', ');

    const fullAddressParts2 = [
        ad.neighborhood,
        ad.cities?.name,
    ];
    const addressPart2 = fullAddressParts2.filter(Boolean).join(', ');
    
    const fullAddress = [addressPart1, addressPart2, ad.cities?.state].filter(Boolean).join(' - ');

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden bg-card border border-border hover:shadow-lg hover:shadow-primary/20 transition-shadow">
                <Link to={`/anuncio/${ad.slug}`}>
                    <div className="relative">
                        <img src={mainImage} alt={`Imagem de ${ad.title}`} className="h-48 w-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                        <p className="text-sm text-primary font-semibold">{ad.categories?.name}</p>
                        <h3 className="text-lg font-bold text-foreground mt-1 line-clamp-3 h-[4.5rem]">{ad.title}</h3>
                        <div className="flex items-start text-sm text-muted-foreground mt-2">
                            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-3 h-[3.75rem]">{fullAddress}</span>
                        </div>
                        {reviewStats.count > 0 && (
                            <div className="flex items-center mt-4">
                                <StarRating rating={reviewStats.avg} size={4} readOnly />
                            </div>
                        )}
                    </CardContent>
                </Link>
            </Card>
        </motion.div>
    );
};

export default AdCard;