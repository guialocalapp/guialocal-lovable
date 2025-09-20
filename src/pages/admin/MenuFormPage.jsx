import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMenus } from '@/hooks/useMenus';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const MenuFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { menuItems, addMenuItem, updateMenuItem, getMenuItemById } = useMenus();
    const { toast } = useToast();

    const isEditing = Boolean(id);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [location, setLocation] = useState('header');
    const [order_index, setOrderIndex] = useState(0);
    const [parentId, setParentId] = useState(null);

    const parentMenuOptions = useMemo(() => {
        const itemsByLocation = menuItems.filter(item => item.location === location && item.id !== id);
        const itemMap = new Map(itemsByLocation.map(item => [item.id, { ...item, children: [] }]));

        const getLevel = (itemId) => {
            let level = 1;
            let current = itemMap.get(itemId);
            while (current && current.parent_id) {
                level++;
                current = itemMap.get(current.parent_id);
            }
            return level;
        };

        const options = [];
        const buildOptions = (parentId = null, level = 1) => {
            if (level > 2) return; // Only allow level 1 and 2 items to be parents

            itemsByLocation
                .filter(item => item.parent_id === parentId)
                .sort((a, b) => a.order_index - b.order_index)
                .forEach(item => {
                    options.push({
                        ...item,
                        label: `${'—'.repeat(level - 1)} ${item.title}`.trim()
                    });
                    buildOptions(item.id, level + 1);
                });
        };

        buildOptions();
        return options;
    }, [menuItems, location, id]);

    useEffect(() => {
        if (isEditing) {
            const item = getMenuItemById(id);
            if (item) {
                setTitle(item.title);
                setLink(item.link);
                setLocation(item.location);
                setOrderIndex(item.order_index);
                setParentId(item.parent_id || null);
            } else {
                toast({ variant: "destructive", title: "Erro!", description: "Item de menu não encontrado." });
                navigate('/admin/menus');
            }
        }
    }, [id, isEditing, getMenuItemById, navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !link.trim()) {
            toast({ variant: "destructive", title: "Erro!", description: "Título e Link são obrigatórios." });
            return;
        }

        try {
            const menuItemData = { 
                title, 
                link, 
                location, 
                order_index: Number(order_index) || 0,
                parent_id: parentId === 'null' ? null : parentId
            };
            if (isEditing) {
                await updateMenuItem(id, menuItemData);
            } else {
                await addMenuItem(menuItemData);
            }
            navigate('/admin/menus');
        } catch (error) {
            toast({ variant: "destructive", title: "Erro!", description: error.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>{isEditing ? 'Editar Item de Menu' : 'Novo Item de Menu'} - Admin - Guia Local</title>
            </Helmet>

             <div className="mb-4">
                <Link to="/admin/menus" className="flex items-center text-sm text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Menus
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{isEditing ? 'Editar Item de Menu' : 'Novo Item de Menu'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="link">Link</Label>
                            <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/exemplo" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="location">Localização</Label>
                                <Select value={location} onValueChange={setLocation} required>
                                    <SelectTrigger id="location">
                                        <SelectValue placeholder="Selecione a localização" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="header">Menu do Topo</SelectItem>
                                        <SelectItem value="footer">Menu do Rodapé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="order_index">Ordem de Exibição</Label>
                                <Input id="order_index" type="number" value={order_index} onChange={(e) => setOrderIndex(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="parent_id">Menu Pai (para submenus)</Label>
                            <Select value={parentId || 'null'} onValueChange={(value) => setParentId(value)}>
                                <SelectTrigger id="parent_id">
                                    <SelectValue placeholder="Nenhum (menu principal)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">Nenhum (menu principal)</SelectItem>
                                    {parentMenuOptions.map(item => (
                                        <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                         <Button type="button" variant="ghost" onClick={() => navigate('/admin/menus')}>Cancelar</Button>
                         <Button type="submit">Salvar</Button>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
};

export default MenuFormPage;