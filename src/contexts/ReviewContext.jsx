import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                user:user_id ( full_name ),
                listing:listing_id ( title, slug )
            `)
            .order('created_at', { ascending: false });
        if (error) {
            toast({ variant: "destructive", title: "Erro ao buscar avaliações", description: error.message });
        } else {
            setReviews(data);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const addReview = async (reviewData) => {
        const { data, error } = await supabase.from('reviews').insert([reviewData]).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao enviar avaliação", description: error.message });
            throw error;
        }
        toast({ title: "Avaliação enviada com sucesso! Aguardando moderação." });
        await fetchReviews();
        return data[0];
    };

    const updateReview = async (id, reviewData) => {
        const { data, error } = await supabase.from('reviews').update(reviewData).eq('id', id).select();
        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar avaliação", description: error.message });
            throw error;
        }
        toast({ title: "Avaliação atualizada com sucesso!" });
        await fetchReviews();
        return data[0];
    };

    const updateReviewStatus = async (id, status) => {
        const { data, error } = await supabase
            .from('reviews')
            .update({ status: status })
            .eq('id', id)
            .select();

        if (error) {
            toast({ variant: "destructive", title: "Erro ao atualizar status da avaliação", description: error.message });
            return null;
        }
        
        toast({ title: `Avaliação ${status === 'Aprovado' ? 'aprovada' : 'reprovada'} com sucesso!` });
        await fetchReviews();
        return data;
    };

    const deleteReview = async (id) => {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) {
            toast({ variant: "destructive", title: "Erro ao deletar avaliação", description: error.message });
            return false;
        }
        toast({ title: "Avaliação deletada com sucesso!" });
        await fetchReviews();
        return true;
    };

    return (
        <ReviewContext.Provider value={{ reviews, loading, fetchReviews, addReview, updateReview, updateReviewStatus, deleteReview }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviews = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};