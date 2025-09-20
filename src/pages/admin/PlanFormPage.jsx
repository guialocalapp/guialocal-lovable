import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePlans } from '@/hooks/usePlans';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload } from 'lucide-react';

const PlanFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addPlan, updatePlan, getPlanById } = usePlans();
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    const isEditing = Boolean(id);
    const [planData, setPlanData] = useState({
        name: '',
        monthlyPrice: '',
        annualPrice: '',
        adLimit: '',
        imageLimit: '',
        videoLimit: '',
        description: '',
        icon: null,
    });
    const [iconPreview, setIconPreview] = useState(null);

    useEffect(() => {
        if (isEditing) {
            const plan = getPlanById(id);
            if (plan) {
                setPlanData({
                    name: plan.name,
                    monthlyPrice: plan.monthlyPrice,
                    annualPrice: plan.annualPrice,
                    adLimit: plan.adLimit === -1 ? 'Ilimitado' : plan.adLimit,
                    imageLimit: plan.imageLimit === -1 ? 'Ilimitado' : plan.imageLimit,
                    videoLimit: plan.videoLimit === -1 ? 'Ilimitado' : plan.videoLimit,
                    description: plan.description || '',
                    icon: plan.icon || null,
                });
                setIconPreview(plan.icon || null);
            } else {
                toast({ variant: "destructive", title: "Erro!", description: "Plano não encontrado." });
                navigate('/admin/plans');
            }
        }
    }, [id, isEditing, getPlanById, navigate, toast]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPlanData((prev) => ({ ...prev, [id]: value }));
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPlanData(prev => ({ ...prev, icon: reader.result }));
                setIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, monthlyPrice, annualPrice, adLimit, imageLimit, videoLimit } = planData;

        if (!name.trim()) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'O nome do plano é obrigatório.',
            });
            return;
        }
        
        if (monthlyPrice === '' || annualPrice === '' || adLimit === '' || imageLimit === '' || videoLimit === '') {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Todos os campos de preço e limite devem ser preenchidos.',
            });
            return;
        }


        const parseLimit = (value) => {
            const lowerCaseValue = String(value).toLowerCase();
            return lowerCaseValue === 'ilimitado' ? -1 : parseInt(value, 10);
        };

        const finalAdLimit = parseLimit(adLimit);
        const finalImageLimit = parseLimit(imageLimit);
        const finalVideoLimit = parseLimit(videoLimit);
        
        const planPayload = {
            name: name.trim(),
            monthlyPrice: parseFloat(monthlyPrice),
            annualPrice: parseFloat(annualPrice),
            adLimit: finalAdLimit,
            imageLimit: finalImageLimit,
            videoLimit: finalVideoLimit,
            description: planData.description,
            icon: planData.icon,
        };

        if (isNaN(planPayload.monthlyPrice) || isNaN(planPayload.annualPrice)) {
             toast({
                variant: 'destructive',
                title: 'Erro de Formato',
                description: 'Os valores mensais e anuais devem ser números válidos.',
            });
            return;
        }

        if (finalAdLimit !== -1 && isNaN(finalAdLimit)) {
             toast({
                variant: 'destructive',
                title: 'Erro de Formato',
                description: 'Limite de anúncios deve ser um número ou "Ilimitado".',
            });
            return;
        }
        if (finalImageLimit !== -1 && isNaN(finalImageLimit)) {
             toast({
                variant: 'destructive',
                title: 'Erro de Formato',
                description: 'Quantidade de imagens deve ser um número ou "Ilimitado".',
            });
            return;
        }
        if (finalVideoLimit !== -1 && isNaN(finalVideoLimit)) {
             toast({
                variant: 'destructive',
                title: 'Erro de Formato',
                description: 'Quantidade de vídeos deve ser um número ou "Ilimitado".',
            });
            return;
        }


        if (isEditing) {
            await updatePlan(id, planPayload);
        } else {
            await addPlan(planPayload);
        }
        navigate('/admin/plans');
    };

    return (
        <>
            <Helmet>
                <title>{isEditing ? 'Editar Plano' : 'Novo Plano'} - Admin - Guia Local</title>
            </Helmet>

            <div className="mb-4">
                <Link to="/admin/plans" className="flex items-center text-sm text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Planos
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Editar Plano' : 'Novo Plano'}</CardTitle>
                        <CardDescription>Preencha os detalhes do plano abaixo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Plano</Label>
                            <Input id="name" value={planData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="monthlyPrice">Valor Mensal (R$)</Label>
                                <Input id="monthlyPrice" type="number" step="0.01" value={planData.monthlyPrice} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="annualPrice">Valor Anual (R$)</Label>
                                <Input id="annualPrice" type="number" step="0.01" value={planData.annualPrice} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="adLimit">Limite de Anúncios (ou "Ilimitado")</Label>
                                <Input id="adLimit" value={planData.adLimit} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageLimit">Quantidade de Imagens (ou "Ilimitado")</Label>
                                <Input id="imageLimit" value={planData.imageLimit} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="videoLimit">Quantidade de Vídeos (ou "Ilimitado")</Label>
                                <Input id="videoLimit" value={planData.videoLimit} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ícone do Plano</Label>
                            <div className="flex items-center gap-4">
                                {iconPreview ? (
                                    <img src={iconPreview} alt="Pré-visualização" className="h-16 w-16 rounded-md object-cover" />
                                ) : (
                                    <div className="h-16 w-16 rounded-md bg-gray-700 flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-gray-500" />
                                    </div>
                                )}
                                <Input id="icon-upload" type="file" accept="image/*" onChange={handleIconChange} className="hidden" ref={fileInputRef} />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    Carregar Ícone
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" value={planData.description} onChange={handleInputChange} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                        <Button type="button" variant="ghost" onClick={() => navigate('/admin/plans')}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
};

export default PlanFormPage;