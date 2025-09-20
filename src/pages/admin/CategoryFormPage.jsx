import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { generateUniqueSlug } from '@/lib/utils';

const CategoryFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { categories, addCategory, updateCategory, getCategoryById } = useCategories();
    const { toast } = useToast();

    const isEditing = Boolean(id);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [parent_id, setParentId] = useState('null');

    const parentCategories = categories.filter(cat => !cat.parent_id && cat.id !== id);

    useEffect(() => {
        if (isEditing && id) {
            const category = getCategoryById(id);
            if (category) {
                setName(category.name);
                setSlug(category.slug || '');
                setParentId(category.parent_id || 'null');
            } else {
                toast({ variant: "destructive", title: "Erro!", description: "Categoria não encontrada." });
                navigate('/admin/categories');
            }
        }
    }, [id, isEditing, getCategoryById, navigate, toast]);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({ variant: "destructive", title: "Erro!", description: "O nome da categoria não pode estar vazio." });
            return;
        }
        
        try {
            let finalSlug = slug;
            if (!isEditing || (isEditing && getCategoryById(id)?.name !== name)) {
                finalSlug = await generateUniqueSlug(name, 'categories');
            }

            const categoryData = { 
                name, 
                slug: finalSlug, 
                parent_id: parent_id === 'null' ? null : parent_id 
            };
            
            if (isEditing) {
                await updateCategory(id, categoryData);
                toast({ title: "Sucesso!", description: "Categoria atualizada." });
            } else {
                await addCategory(categoryData);
                toast({ title: "Sucesso!", description: "Categoria adicionada." });
            }
            navigate('/admin/categories');
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>{isEditing ? 'Editar Categoria' : 'Nova Categoria'} - Admin - Guia Local</title>
            </Helmet>

             <div className="mb-4">
                <Link to="/admin/categories" className="flex items-center text-sm text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Categorias
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome da Categoria</Label>
                            <Input id="name" value={name} onChange={handleNameChange} required />
                        </div>
                        <div>
                            <Label htmlFor="parent_id">Categoria Pai</Label>
                            <Select value={parent_id} onValueChange={setParentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">Nenhuma (Categoria Principal)</SelectItem>
                                    {parentCategories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {isEditing && (
                            <div>
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={slug} readOnly disabled />
                                <p className="text-xs text-muted-foreground mt-1">O slug não pode ser editado diretamente para manter a consistência dos links.</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                         <Button type="button" variant="ghost" onClick={() => navigate('/admin/categories')}>Cancelar</Button>
                         <Button type="submit">Salvar</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
};

export default CategoryFormPage;