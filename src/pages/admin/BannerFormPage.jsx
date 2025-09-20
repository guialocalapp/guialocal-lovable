import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { useParams, useNavigate, Link } from 'react-router-dom';
    import { useBanners } from '@/hooks/useBanners';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { ArrowLeft } from 'lucide-react';

    const BannerFormPage = () => {
        const { id } = useParams();
        const navigate = useNavigate();
        const { addBanner, updateBanner, getBannerById } = useBanners();
        const { toast } = useToast();

        const isEditing = Boolean(id);
        const [title, setTitle] = useState('');
        const [link, setLink] = useState('');
        const [location, setLocation] = useState('');
        const [status, setStatus] = useState('ativo');
        const [image, setImage] = useState('');
        const [imageMobile, setImageMobile] = useState('');
        const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');

        useEffect(() => {
            if (isEditing) {
                const banner = getBannerById(id);
                if (banner) {
                    setTitle(banner.title);
                    setLink(banner.link || '');
                    setLocation(banner.location || '');
                    setStatus(banner.status || 'ativo');
                    setImage(banner.image || '');
                    setImageMobile(banner.image_mobile || '');
                    setYoutubeVideoUrl(banner.youtube_video_url || '');
                    setStartDate(banner.start_date ? new Date(banner.start_date).toISOString().split('T')[0] : '');
                    setEndDate(banner.end_date ? new Date(banner.end_date).toISOString().split('T')[0] : '');
                } else {
                    toast({ variant: "destructive", title: "Erro!", description: "Banner não encontrado." });
                    navigate('/admin/banners');
                }
            }
        }, [id, isEditing, getBannerById, navigate, toast]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!title.trim() || !location) {
                toast({ variant: "destructive", title: "Erro!", description: "Título e localização são obrigatórios." });
                return;
            }
            if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
                toast({ variant: "destructive", title: "Erro!", description: "A data de fim não pode ser anterior à data de início." });
                return;
            }

            const bannerData = { 
                title, 
                link: link || null, 
                location, 
                status, 
                image: image || null,
                image_mobile: imageMobile || null,
                youtube_video_url: youtubeVideoUrl || null,
                start_date: startDate || null, 
                end_date: endDate || null 
            };

            try {
                if (isEditing) {
                    await updateBanner(id, bannerData);
                } else {
                    await addBanner(bannerData);
                }
                navigate('/admin/banners');
            } catch (error) {
                 toast({ variant: "destructive", title: "Erro ao salvar!", description: error.message });
            }
        };

        return (
            <>
                <Helmet>
                    <title>{isEditing ? 'Editar Banner' : 'Novo Banner'} - Admin - Guia Local</title>
                </Helmet>

                 <div className="mb-4">
                    <Link to="/admin/banners" className="flex items-center text-sm text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Banners
                    </Link>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>{isEditing ? 'Editar Banner' : 'Novo Banner'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="image">URL da Imagem (Desktop)</Label>
                                    <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://exemplo.com/imagem.jpg" />
                                </div>
                                <div>
                                    <Label htmlFor="imageMobile">URL da Imagem (Mobile)</Label>
                                    <Input id="imageMobile" value={imageMobile} onChange={(e) => setImageMobile(e.target.value)} placeholder="https://exemplo.com/imagem-mobile.jpg" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="youtubeVideoUrl">URL do Vídeo do YouTube</Label>
                                <Input id="youtubeVideoUrl" value={youtubeVideoUrl} onChange={(e) => setYoutubeVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Preencha para exibir um vídeo em vez da imagem.
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="link">Link de Destino</Label>
                                <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/promocoes" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                    <Label htmlFor="startDate">Data de Início</Label>
                                    <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                               </div>
                               <div>
                                    <Label htmlFor="endDate">Data de Fim</Label>
                                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                               </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="location">Localização</Label>
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger id="location">
                                            <SelectValue placeholder="Selecione a localização" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="home_top">Home (Topo)</SelectItem>
                                            <SelectItem value="home_bottom">Home (Rodapé)</SelectItem>
                                            <SelectItem value="sidebar">Barra Lateral</SelectItem>
                                            <SelectItem value="category_page">Página de Categoria</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ativo">Ativo</SelectItem>
                                            <SelectItem value="inativo">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                             <Button type="button" variant="ghost" onClick={() => navigate('/admin/banners')}>Cancelar</Button>
                             <Button type="submit">Salvar</Button>
                        </CardFooter>
                    </form>
                </Card>
            </>
        );
    };

    export default BannerFormPage;