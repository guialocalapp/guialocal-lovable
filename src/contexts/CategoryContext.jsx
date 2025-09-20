import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar categorias", description: error.message });
        } else {
            setCategories(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    
    const structuredCategories = useMemo(() => {
        const categoryMap = {};
        const roots = [];

        categories.forEach(category => {
            categoryMap[category.id] = { ...category, children: [] };
        });

        categories.forEach(category => {
            if (category.parent_id && categoryMap[category.parent_id]) {
                categoryMap[category.parent_id].children.push(categoryMap[category.id]);
            } else {
                roots.push(categoryMap[category.id]);
            }
        });

        return roots;
    }, [categories]);

    const getCategoryWithChildren = useCallback((slug) => {
        const parentCategory = categories.find(c => c.slug === slug);
        if (!parentCategory) return null;

        const children = categories.filter(c => c.parent_id === parentCategory.id);
        return { ...parentCategory, children };
    }, [categories]);

    const addCategory = async (categoryData) => {
        const { data, error } = await supabase.from('categories').insert([categoryData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao adicionar categoria", description: error.message });
            return null;
        }
        toast({ title: "Categoria adicionada com sucesso!" });
        setCategories(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
        return data[0];
    };

    const updateCategory = async (id, categoryData) => {
        const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar categoria", description: error.message });
            return null;
        }
        toast({ title: "Categoria atualizada com sucesso!" });
        setCategories(prev => prev.map(c => (c.id === id ? data[0] : c)).sort((a, b) => a.name.localeCompare(b.name)));
        return data[0];
    };

    const deleteCategory = async (id) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar categoria", description: error.message });
            return false;
        }
        toast({ title: "Categoria deletada com sucesso!" });
        setCategories(prev => prev.filter(c => c.id !== id));
        return true;
    };

    const getCategoryById = useCallback((id) => {
        return categories.find(c => c.id === id);
    }, [categories]);

    return (
        <CategoryContext.Provider value={{ 
            categories, 
            structuredCategories,
            loading, 
            addCategory, 
            updateCategory, 
            deleteCategory, 
            getCategoryById, 
            getCategoryWithChildren,
            fetchCategories 
        }}>
            {children}
        </CategoryContext.Provider>
    );
};