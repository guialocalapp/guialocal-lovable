import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({ rating = 0, size = 4, className = '', onRatingChange, readOnly = true }) => {
    const totalStars = 5;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <Star
                        key={index}
                        className={cn(
                            'transition-colors',
                            starValue <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
                            !readOnly && 'cursor-pointer hover:text-yellow-300'
                        )}
                        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
                        onClick={() => !readOnly && onRatingChange && onRatingChange(starValue)}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;