import React from 'react';
    import { useCategories } from '@/hooks/useCategories';
    import { useCities } from '@/hooks/useCities';
    import { useFacilities } from '@/hooks/useFacilities';
    import { usePaymentMethods } from '@/hooks/usePaymentMethods';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { MapPin, Phone, Mail, Globe } from 'lucide-react';
    import MapboxMap from '@/components/site/MapboxMap';
    import OpeningHoursStatus from '@/components/site/OpeningHoursStatus';
    import SocialMediaIcons from '@/components/site/SocialMediaIcons';
    import ContactButtons from '@/components/site/ContactButtons';

    const DefaultAdLayout = ({ ad }) => {
        const { getCategoryById } = useCategories();
        const { getCityById } = useCities();
        const { facilities, getFacilityIcon } = useFacilities();
        const { paymentMethods } = usePaymentMethods();

        const category = getCategoryById(ad.category_id);
        const city = getCityById(ad.city_id);
        
        const adFacilities = facilities.filter(f => ad.listing_facilities?.some(lf => lf.facility_id === f.id));
        const adPaymentMethods = paymentMethods.filter(pm => ad.listing_payment_methods?.some(lpm => lpm.payment_method_id === pm.id));
        
        const mainImage = ad.images && ad.images.length > 0 ? ad.images[0] : 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1170&q=80';
        const galleryImages = ad.images && ad.images.length > 1 ? ad.images.slice(1) : [];

        const fullAddress = [
            `${ad.street || ''}${ad.number ? `, ${ad.number}` : ''}`,
            ad.neighborhood,
            `${city?.name || ''}${city?.state ? ` - ${city.state}` : ''}`
        ].filter(Boolean).join(' - ');
        
        return (
            <>
                <div className="relative h-64 md:h-80 bg-secondary">
                    <img src={mainImage} alt={`Imagem principal de ${ad.title}`} className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 container mx-auto px-4 py-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{ad.title}</h1>
                        {category && <p className="text-lg text-primary">{category.name}</p>}
                        {(ad.street || ad.number || ad.neighborhood || city) && (
                            <div className="flex items-center text-muted-foreground mt-2">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{fullAddress}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {ad.description && (
                            <Card>
                                <CardHeader><CardTitle>Sobre o Local</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{ad.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {galleryImages.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Galeria de Fotos</CardTitle></CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {galleryImages.map((imgUrl, index) => (
                                        <a key={index} href={imgUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={imgUrl} alt={`Galeria ${index + 1}`} className="rounded-lg object-cover aspect-square transition-transform duration-300 hover:scale-105" />
                                        </a>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {adFacilities.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Facilidades</CardTitle></CardHeader>
                                <CardContent className="flex flex-wrap gap-4">
                                    {adFacilities.map((facility) => {
                                        const Icon = getFacilityIcon(facility.icon);
                                        return (
                                            <div key={facility.id} className="flex items-center gap-2 text-muted-foreground bg-secondary px-3 py-2 rounded-md">
                                                <Icon className="w-5 h-5 text-primary" />
                                                <span>{facility.name}</span>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        )}

                         {adPaymentMethods.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Formas de Pagamento</CardTitle></CardHeader>
                                <CardContent className="flex flex-wrap gap-4">
                                    {adPaymentMethods.map((pm) => (
                                        <div key={pm.id} className="flex items-center gap-2 text-muted-foreground bg-secondary px-3 py-2 rounded-md">
                                            <span>{pm.name}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader><CardTitle>Localização</CardTitle></CardHeader>
                            <CardContent className="h-96 p-0">
                               <MapboxMap latitude={Number(ad.latitude)} longitude={Number(ad.longitude)} adTitle={ad.title} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-24 self-start">
                        <ContactButtons ad={ad} />
                        <Card>
                            <CardHeader><CardTitle>Horário de Funcionamento</CardTitle></CardHeader>
                            <CardContent>
                                <OpeningHoursStatus openingHours={ad.opening_hours} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Informações de Contato</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {ad.street && city && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 mt-1 text-primary flex-shrink-0" /><span className="text-muted-foreground">{fullAddress}</span></div>}
                                {ad.phone && <div className="flex items-start gap-3"><Phone className="w-5 h-5 mt-1 text-primary flex-shrink-0" /><span className="text-muted-foreground">{ad.phone}</span></div>}
                                {ad.email && <div className="flex items-start gap-3"><Mail className="w-5 h-5 mt-1 text-primary flex-shrink-0" /><a href={`mailto:${ad.email}`} className="text-muted-foreground hover:text-primary break-all">{ad.email}</a></div>}
                                {ad.website && <div className="flex items-start gap-3"><Globe className="w-5 h-5 mt-1 text-primary flex-shrink-0" /><a href={ad.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary break-all">{ad.website}</a></div>}
                                <SocialMediaIcons ad={ad} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        );
    };

    export default DefaultAdLayout;