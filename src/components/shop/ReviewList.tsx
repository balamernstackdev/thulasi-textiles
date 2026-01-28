import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewList({ reviews }: { reviews: any[] }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-12 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No reviews yet. Be the first to share your experience!</p>
            </div>
        );
    }

    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    return (
        <div className="space-y-12">
            {/* Global Rating Summary */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
                <div className="bg-orange-600 text-white p-8 rounded-[2rem] shadow-2xl shadow-orange-500/20 text-center md:text-left min-w-[180px]">
                    <div className="text-5xl font-black italic tracking-tighter mb-1">{averageRating.toFixed(1)}</div>
                    <div className="flex justify-center md:justify-start gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${s <= Math.round(averageRating) ? 'fill-white text-white' : 'fill-white/20 text-transparent'}`}
                            />
                        ))}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Based on {reviews.length} reviews</div>
                </div>

                <div className="flex-1 grid grid-cols-1 gap-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = (count / reviews.length) * 100;
                        return (
                            <div key={rating} className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-gray-400 w-4">{rating}</span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 w-8 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 uppercase tracking-tight">{review.user?.name || 'Verified Customer'}</div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-orange-500 text-orange-500' : 'fill-gray-100 text-gray-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed text-sm italic mb-6">
                            "{review.comment}"
                        </p>

                        {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
                                {review.images.map((img: any) => (
                                    <div key={img.id} className="w-20 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-100 shrink-0">
                                        <img src={img.url} alt="Review attachment" className="w-full h-full object-cover transition-transform hover:scale-110" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
