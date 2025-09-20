import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*, plan:plan_id(name)')
            .order('created_at', { ascending: false });
        
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar usuários", description: error.message });
            setUsers([]);
            setClients([]);
        } else {
            setUsers(data.filter(u => u.role === 'admin'));
            setClients(data.filter(u => u.role === 'client'));
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const addUser = async (userData) => {
        // This is handled by Supabase Auth signUp
        await fetchUsers();
        return null;
    };

    const updateUser = async (id, userData) => {
        const { data, error } = await supabase.from('profiles').update(userData).eq('id', id).select().single();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar usuário", description: error.message });
            return null;
        }
        toast({ title: "Usuário atualizado com sucesso!" });
        await fetchUsers();
        return data;
    };

    const deleteUser = async (id) => {
        const { error } = await supabase.auth.admin.deleteUser(id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar usuário", description: error.message });
            return false;
        }
        toast({ title: "Usuário deletado com sucesso!" });
        await fetchUsers();
        return true;
    };

    const getUserById = useCallback((id) => {
        return [...users, ...clients].find(u => u.id === id);
    }, [users, clients]);

    const getAffiliatesByUserId = useCallback(async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, created_at')
            .eq('affiliate_id', userId);

        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar afiliados", description: error.message });
            return [];
        }
        return data;
    }, [toast]);

    const getAffiliateCommissions = useCallback(async () => {
        const { data, error } = await supabase
            .from('payments')
            .select(`
                amount,
                created_at,
                user:user_id!inner(
                    full_name,
                    affiliate_id!inner(
                        id,
                        full_name,
                        pix_key
                    )
                )
            `)
            .eq('status', 'CONFIRMED');

        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar comissões", description: error.message });
            return [];
        }
        return data;
    }, [toast]);

    return (
        <UserContext.Provider value={{ users, clients, loading, addUser, updateUser, deleteUser, getUserById, fetchUsers, getAffiliatesByUserId, getAffiliateCommissions }}>
            {children}
        </UserContext.Provider>
    );
};