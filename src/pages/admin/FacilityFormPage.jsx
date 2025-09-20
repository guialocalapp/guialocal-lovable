import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFacilities } from '@/hooks/useFacilities';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const FacilityFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addFacility, updateFacility, getFacilityById } = useFacilities();
    const { toast } = useToast();

    const isEditing = Boolean(id);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        if (isEditing) {
            const facility = getFacilityById(id);
            if (facility) {
                setName(facility.name);
                setIcon(facility.icon);
            } else {
                toast({ variant: "destructive", title: "Erro!", description: "Facilidade não encontrada." });
                navigate('/admin/facilities');
            }
        }
    }, [id, isEditing, getFacilityById, navigate, toast]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !icon.trim()) {
            toast({ variant: "destructive", title: "Erro!", description: "Nome e ícone são obrigatórios." });
            return;
        }
        try {
            const facilityData = { name, icon };
            if (isEditing) {
                updateFacility(id, facilityData);
                toast({ title: "Sucesso!", description: "Facilidade atualizada." });
            } else {
                addFacility(facilityData);
                toast({ title: "Sucesso!", description: "Facilidade adicionada." });
            }
            navigate('/admin/facilities');
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>{isEditing ? 'Editar Facilidade' : 'Nova Facilidade'} - Admin - Guia Local</title>
            </Helmet>

             <div className="mb-4">
                <Link to="/admin/facilities" className="flex items-center text-sm text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Facilidades
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Editar Facilidade' : 'Nova Facilidade'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome da Facilidade</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Wi-Fi Grátis" />
                        </div>
                        <div>
                            <Label htmlFor="icon">Nome do Ícone (Lucide)</Label>
                            <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} required placeholder="Ex: Wifi" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Use o nome de um ícone da biblioteca <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Lucide Icons</a>.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                         <Button type="button" variant="ghost" onClick={() => navigate('/admin/facilities')}>Cancelar</Button>
                         <Button type="submit">Salvar</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
};

export default FacilityFormPage;