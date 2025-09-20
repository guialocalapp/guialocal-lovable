import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchMenus = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('menus').select('*').order('order_index');
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar menus", description: error.message });
        } else {
            setMenuItems(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const addMenuItem = async (menuData) => {
        const { data, error } = await supabase.from('menus').insert([menuData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar item de menu", description: error.message });
            return null;
        }
        toast({ title: "Item de menu adicionado com sucesso!" });
        await fetchMenus();
        return data[0];
    };

    const updateMenuItem = async (id, menuData) => {
        const { data, error } = await supabase.from('menus').update(menuData).eq('id', id).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar item de menu", description: error.message });
            return null;
        }
        toast({ title: "Item de menu atualizado com sucesso!" });
        await fetchMenus();
        return data[0];
    };

    const deleteMenuItem = async (id) => {
        const { error } = await supabase.from('menus').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar item de menu", description: error.message });
            return false;
        }
        toast({ title: "Item de menu deletado com sucesso!" });
        await fetchMenus();
        return true;
    };

    const getMenuItemById = useCallback((id) => {
        return menuItems.find(m => m.id === id);
    }, [menuItems]);

    const value = {
        menuItems,
        loading,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getMenuItemById,
        fetchMenus
    };

    return (
        <MenuContext.Provider value={value}>
            {children}
        </MenuContext.Provider>
    );
};