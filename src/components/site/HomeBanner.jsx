import React, { useState, useEffect } from 'react';
import { useBanners } from '@/hooks/useBanners';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeBanner = () => {
    const { activeHomeTopBanners, loading } = useBanners();
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (loading) {
        return (
            <div className="relative w-full h-[60vh] flex items-center justify-center bg-secondary">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!activeHomeTopBanners || activeHomeTopBanners.length === 0) {
        return (
             <div className="relative isolate overflow-hidden bg-background">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/50"></div>
                    <img className="absolute inset-0 w-full h-full object-cover opacity-10" alt="Mapa abstrato da cidade com pontos de neon" src="https://images.unsplash.com/photo-1689546480276-6d7b7ed40ab0" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl py-24 sm:py-32 lg:py-40 text-center">
                    <motion.h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        Conectando você ao <span className="text-primary">coração da cidade</span>
                    </motion.h1>
                    <motion.p className="mt-6 text-lg leading-8 text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
                        Encontre os melhores comércios, restaurantes e serviços em Gravataí e Cachoeirinha.
                    </motion.p>
                </div>
            </div>
        )
    }
    
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId;
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else {
            return null;
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;
    };

    const renderBannerContent = (banner) => {
        const videoUrl = getYoutubeEmbedUrl(banner.youtube_video_url);
        const imageUrl = isMobile && banner.image_mobile ? banner.image_mobile : banner.image;

        if (videoUrl) {
            return (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <iframe
                        src={videoUrl}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.5)', width: '100%', height: '100%' }}
                    ></iframe>
                </div>
            );
        }

        if (imageUrl) {
            return <img src={imageUrl} alt={banner.title} className="w-full h-full object-cover" />;
        }
        
        return <div className="w-full h-full bg-secondary flex items-center justify-center"><p className="text-muted-foreground">{banner.title}</p></div>;
    };
    
    const BannerWrapper = ({ banner, children }) => {
        if (banner.link) {
            if (banner.link.startsWith('http')) {
                return <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">{children}</a>;
            }
            return <Link to={banner.link} className="block w-full h-full">{children}</Link>;
        }
        return <div className="w-full h-full">{children}</div>;
    };


    if (activeHomeTopBanners.length === 1) {
        const banner = activeHomeTopBanners[0];
        return (
            <div className="relative w-full h-[60vh] bg-black">
                 <BannerWrapper banner={banner}>
                    {renderBannerContent(banner)}
                    <div className="absolute inset-0 bg-black/30"></div>
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                        <motion.h1
                          className="text-4xl lg:text-6xl font-extrabold drop-shadow-2xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                        >
                          {banner.title}
                        </motion.h1>
                    </div>
                </BannerWrapper>
            </div>
        );
    }
    
    return (
        <Carousel
            className="w-full"
            plugins={[Autoplay({ delay: 10000, stopOnInteraction: true })]}
            opts={{ loop: true }}
        >
            <CarouselContent className="-ml-0 h-[60vh]">
                {activeHomeTopBanners.map((banner) => (
                    <CarouselItem key={banner.id} className="pl-0">
                        <div className="relative w-full h-full bg-black">
                            <BannerWrapper banner={banner}>
                                {renderBannerContent(banner)}
                                <div className="absolute inset-0 bg-black/30"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                                     <motion.h1
                                      className="text-4xl lg:text-6xl font-extrabold drop-shadow-2xl"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.7 }}
                                    >
                                      {banner.title}
                                    </motion.h1>
                                </div>
                            </BannerWrapper>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {activeHomeTopBanners.length > 1 && (
                 <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/80 text-foreground" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/80 text-foreground" />
                 </>
            )}
        </Carousel>
    );
};

export default HomeBanner;