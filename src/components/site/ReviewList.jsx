import React from 'react';
import StarRating from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ReviewList = ({ reviews }) => {

    const getInitials = (name) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (!reviews || reviews.length === 0) {
        return <p className="text-muted-foreground">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>;
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={review.user?.avatar_url} />
                        <AvatarFallback>{getInitials(review.user?.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{review.user?.full_name || 'Anônimo'}</h4>
                            <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <StarRating rating={review.rating} className="my-1" />
                        <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;