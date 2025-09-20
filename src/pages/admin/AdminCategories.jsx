import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2, CornerDownRight } from 'lucide-react';

const AdminCategories = () => {
    const { categories, deleteCategory } = useCategories();
    const { toast } = useToast();

    const handleDelete = (id) => {
        try {
            deleteCategory(id);
            toast({ title: "Sucesso!", description: "Categoria removida." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        }
    };

    const parentCategories = categories.filter(c => !c.parent_id).sort((a, b) => a.name.localeCompare(b.name));
    const getChildren = (parentId) => categories.filter(c => c.parent_id === parentId).sort((a, b) => a.name.localeCompare(b.name));

    const hierarchicalCategories = parentCategories.flatMap(parent => {
        const children = getChildren(parent.id);
        return [parent, ...children];
    });

    const categoryMap = React.useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

    return (
        <>
            <Helmet>
                <title>Gerenciar Categorias - Admin - Guia Local</title>
            </Helmet>

            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Categorias</h1>
                <Link to="/admin/categories/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Nova Categoria
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Categoria Pai</TableHead>
                                <TableHead className="w-[100px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hierarchicalCategories.length > 0 ? (
                                hierarchicalCategories.map(cat => {
                                    const parent = cat.parent_id ? categoryMap.get(cat.parent_id) : null;
                                    return (
                                        <TableRow key={cat.id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {cat.parent_id && <CornerDownRight className="h-4 w-4 mr-2 text-gray-500" />}
                                                    <span className={`${cat.parent_id ? '' : 'font-bold'}`}>{cat.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-400 text-xs p-1 bg-gray-700 rounded-md">{cat.slug}</span>
                                            </TableCell>
                                            <TableCell>{parent ? parent.name : '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Link to={`/admin/categories/edit/${cat.id}`}>
                                                    <Button variant="outline" size="icon" className="mr-2">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a categoria.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(cat.id)}>Excluir</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Nenhuma categoria encontrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};

export default AdminCategories;