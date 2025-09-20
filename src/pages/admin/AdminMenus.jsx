import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useMenus } from '@/hooks/useMenus';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Edit, Trash2, CornerDownRight } from 'lucide-react';

const MenuTable = ({ items, onDeleteClick }) => {
    const structuredItems = useMemo(() => {
        if (!items || items.length === 0) return [];
        
        const allItems = [];
        const itemMap = new Map(items.map(item => [item.id, { ...item, children: [] }]));

        items.forEach(item => {
            if (item.parent_id && itemMap.has(item.parent_id)) {
                const parent = itemMap.get(item.parent_id);
                const child = itemMap.get(item.id);
                if (parent && child) {
                    parent.children.push(child);
                }
            }
        });

        const topLevelItems = items
            .filter(item => !item.parent_id)
            .map(item => itemMap.get(item.id))
            .sort((a, b) => a.order_index - b.order_index);

        const buildHierarchy = (currentItems, level) => {
            currentItems.sort((a, b) => a.order_index - b.order_index).forEach(item => {
                if (!item) return;
                allItems.push({ ...item, level });
                if (item.children && item.children.length > 0) {
                    buildHierarchy(item.children, level + 1);
                }
            });
        };

        buildHierarchy(topLevelItems, 1);
        return allItems;
    }, [items]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {structuredItems && structuredItems.length > 0 ? (
                    structuredItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                {item.level > 1 && (
                                    <span style={{ paddingLeft: `${(item.level - 1) * 1.5}rem` }}>
                                        <CornerDownRight className="inline-block w-4 h-4 mr-2 text-gray-500" />
                                    </span>
                                )}
                                {item.title}
                            </TableCell>
                            <TableCell>{item.link}</TableCell>
                            <TableCell>{item.order_index}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link to={`/admin/menus/edit/${item.id}`} className="flex items-center cursor-pointer">
                                                <Edit className="mr-2 h-4 w-4" /> Editar
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDeleteClick(item)} className="flex items-center cursor-pointer text-red-500">
                                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan="4" className="h-24 text-center">
                            Nenhum item de menu encontrado.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

const AdminMenus = () => {
    const { menuItems, deleteMenuItem, loading } = useMenus();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            await deleteMenuItem(itemToDelete.id);
            setItemToDelete(null);
        }
        setIsDeleteDialogOpen(false);
    };

    const { headerItems, footerItems } = useMemo(() => {
        const items = Array.isArray(menuItems) ? menuItems : [];
        return {
            headerItems: items.filter(item => item.location === 'header'),
            footerItems: items.filter(item => item.location === 'footer'),
        };
    }, [menuItems]);

    if (loading) {
        return <div className="text-center py-20">Carregando menus...</div>;
    }

    return (
        <>
            <Helmet>
                <title>Gerenciar Menus - Admin - Guia Local</title>
            </Helmet>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Menus</h1>
                <Link to="/admin/menus/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Novo Item de Menu
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Menus do Site</CardTitle>
                    <CardDescription>Gerencie os links de navegação do topo e do rodapé.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="header" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="header">Menu do Topo</TabsTrigger>
                            <TabsTrigger value="footer">Menu do Rodapé</TabsTrigger>
                        </TabsList>
                        <TabsContent value="header">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Itens do Menu do Topo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MenuTable items={headerItems} onDeleteClick={handleDeleteClick} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="footer">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Itens do Menu do Rodapé</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MenuTable items={footerItems} onDeleteClick={handleDeleteClick} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o item de menu
                            <span className="font-bold"> "{itemToDelete?.title}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AdminMenus;