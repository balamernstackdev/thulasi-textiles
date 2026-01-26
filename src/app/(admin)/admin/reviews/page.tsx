import { getAdminReviews, updateReviewStatus, deleteReview } from '@/lib/actions/review';
import { Star, Eye, EyeOff, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
    const res = await getAdminReviews();
    const reviews = res.success ? res.data : [];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Customer Reviews</h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage and moderate product feedback</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {reviews?.map((review: any) => (
                    <div key={review.id} className={`bg-white p-6 rounded-3xl border transition-all ${review.isPublic ? 'border-gray-100' : 'border-rose-100 bg-rose-50/10'}`}>
                        <div className="flex flex-col md:flex-row gap-6 justify-between">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-gray-900 text-sm">{review.user.name}</h3>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">• {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">On: {review.product.name}</p>

                                    <div className="flex gap-0.5 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-orange-500 text-orange-500' : 'fill-gray-100 text-gray-100'}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-gray-600 text-sm font-medium italic leading-relaxed">"{review.comment}"</p>
                                </div>
                            </div>

                            <div className="flex md:flex-col gap-2 justify-end">
                                <form action={async () => {
                                    'use server';
                                    await updateReviewStatus(review.id, !review.isPublic);
                                    revalidatePath('/admin/reviews');
                                }}>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        className={`w-full rounded-xl text-[10px] font-black uppercase tracking-widest ${review.isPublic ? 'text-gray-400' : 'text-emerald-600 border-emerald-100 bg-emerald-50'}`}
                                    >
                                        {review.isPublic ? <><EyeOff className="w-3.5 h-3.5 mr-2" /> Hide</> : <><Eye className="w-3.5 h-3.5 mr-2" /> Publish</>}
                                    </Button>
                                </form>

                                <form action={async () => {
                                    'use server';
                                    await deleteReview(review.id);
                                    revalidatePath('/admin/reviews');
                                }}>
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}


                {(reviews?.length === 0 || !reviews) && (
                    <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                        <Star className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No reviews to manage yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
