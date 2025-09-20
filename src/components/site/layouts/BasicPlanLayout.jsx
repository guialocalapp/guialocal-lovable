import React from 'react';
    import { useCategories } from '@/hooks/useCategories';
    import { useCities } from '@/hooks/useCities';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent } from '@/components/ui/card';
    import { MapPin, Heart } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import MapboxMap from '@/components/site/MapboxMap';

    const BasicPlanLayout = ({ ad }) => {
        const { getCategoryById } = useCategories();
        const { getCityById } = useCities();
        const { toast } = useToast();

        const category = getCategoryById(ad.category_id);
        const city = getCityById(ad.city_id);

        const mainImage = ad.images && ad.images.length > 0 ? ad.images[0] : 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1170&q=80';
        
        const fullAddress = `${ad.street || ''}${ad.number ? ', ' + ad.number : ''}${ad.neighborhood ? ' - ' + ad.neighborhood : ''}${city?.name ? ', ' + city.name : ''}${city?.state ? '/' + city.state : ''}`;

        const handleFeatureNotImplemented = () => {
            toast({
                title: "Em breve! 🚧",
                description: "Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no próximo prompt! 🚀",
            });
        };

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
                        {(ad.street || ad.number || ad.neighborhood || city) && (
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{fullAddress}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {ad.description && (
                                <div>
                                    <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">{ad.description}</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <Card className="overflow-hidden">
                                <img src={mainImage} alt={`Imagem de ${ad.title}`} className="w-full h-auto object-cover" />
                            </Card>
                            <Button variant="outline" className="w-full" onClick={handleFeatureNotImplemented}>
                                <Heart className="w-4 h-4 mr-2" />
                                Faça login para marcar itens
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                15 pessoas marcaram este lugar
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-foreground mb-6">Localização</h2>
                        <Card>
                            <CardContent className="p-2 h-96">
                                <MapboxMap latitude={Number(ad.latitude)} longitude={Number(ad.longitude)} adTitle={ad.title} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    export default BasicPlanLayout;