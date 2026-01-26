'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addReview } from '@/lib/actions/review';

export default function ReviewForm({ productId, onReviewAdded }: { productId: string, onReviewAdded?: () => void }) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating < 1) return toast.error('Please select a rating');

        setIsPending(true);
        try {
            const res = await addReview(productId, rating, comment);
            if (res.success) {
                toast.success('Thank you for your feedback!');
                setComment('');
                setRating(5);
                if (onReviewAdded) onReviewAdded();
                // Optionally refresh page or trigger parent update
                window.location.reload();
            } else {
                toast.error(res.error || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 mb-12">
            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6">Leave a Review</h3>

            <div className="space-y-6">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Rating</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform active:scale-90"
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-8 h-8 ${(hover || rating) >= star
                                        ? 'fill-orange-500 text-orange-500'
                                        : 'text-gray-200 fill-gray-200'
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Your Thoughts</p>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you think of the weave, fabric, and color?"
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all min-h-[120px] placeholder:text-gray-300"
                        required
                    />
                </div>

                <Button
                    disabled={isPending}
                    className="w-full bg-black hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-orange-500/10 transition-all"
                >
                    {isPending ? 'Sending Feedback...' : 'Post Review'}
                </Button>
            </div>
        </form>
    );
}
