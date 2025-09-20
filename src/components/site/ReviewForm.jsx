import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useReviews } from '@/contexts/ReviewContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import StarRating from './StarRating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ReviewForm = ({ listingId, onReviewSubmit, existingReview, onCancelEdit }) => {
    const { user } = useAuth();
    const { addReview, updateReview } = useReviews();
    const { toast } = useToast();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!existingReview;
    const characterLimit = 1000;

    useEffect(() => {
        if (isEditing) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || '');
        }
    }, [existingReview, isEditing]);

    if (!user) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Deixe uma Avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Você precisa estar logado para avaliar.</p>
                </CardContent>
            </Card>
        );
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast({ variant: 'destructive', title: 'Nota obrigatória', description: 'Por favor, selecione uma nota de 1 a 5 estrelas.' });
            return;
        }

        if (!comment.trim()) {
            toast({ variant: 'destructive', title: 'Comentário obrigatório', description: 'Por favor, escreva um comentário sobre sua experiência.' });
            return;
        }

        setIsLoading(true);
        try {
            const reviewData = {
                listing_id: listingId,
                user_id: user.id,
                rating,
                comment,
                status: isEditing ? existingReview.status : 'Aprovado',
            };

            if (isEditing) {
                await updateReview(existingReview.id, { rating, comment });
            } else {
                await addReview(reviewData);
            }
            
            if (!isEditing) {
                setRating(0);
                setComment('');
            }

            if (onReviewSubmit) {
                onReviewSubmit();
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao avaliar', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mt-8 border-t pt-8">
            <CardHeader>
                <CardTitle>{isEditing ? 'Editar sua avaliação' : 'Deixe sua avaliação'}</CardTitle>
                <CardDescription>Compartilhe sua experiência sobre este local.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="rating">Sua nota *</Label>
                        <StarRating rating={rating} onRatingChange={setRating} readOnly={false} size={6} className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="comment">Seu comentário *</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Descreva sua experiência..."
                            className="mt-1"
                            maxLength={characterLimit}
                        />
                         <div className="text-right text-sm text-muted-foreground mt-1">
                            {comment.length} / {characterLimit}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (isEditing ? 'Salvando...' : 'Enviando...') : (isEditing ? 'Salvar Alterações' : 'Enviar Avaliação')}
                        </Button>
                        {isEditing && (
                            <Button variant="outline" onClick={onCancelEdit} disabled={isLoading}>
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ReviewForm;