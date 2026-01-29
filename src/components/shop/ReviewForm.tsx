'use client';

import { useState } from 'react';
import { Star, Plus, X, Image as ImageIcon, Upload } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addReview } from '@/lib/actions/review';

export default function ReviewForm({ productId, onReviewAdded }: { productId: string, onReviewAdded?: () => void }) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isPending, setIsPending] = useState(false);

    const addImageUrl = () => {
        if (imageUrl && !images.includes(imageUrl)) {
            setImages([...images, imageUrl]);
            setImageUrl('');
        }
    };

    const removeImage = (url: string) => {
        setImages(images.filter(i => i !== url));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating < 1) return toast.error('Please select a rating');

        setIsPending(true);
        try {
            const res = await addReview(productId, rating, comment, images);
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
        <form onSubmit={handleSubmit} className="bg-gray-50/50 p-5 md:p-8 rounded-[2rem] border border-gray-100 mb-8 md:mb-12">
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

                <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Add Visual Proof (Photo URLs)</p>
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar py-2">
                        {images.map((url, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group shrink-0 border border-gray-100 shadow-sm">
                                <img src={url} alt="Review" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(url)}
                                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:border-orange-200 hover:text-orange-500 transition-all cursor-pointer shrink-0">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <CldUploadWidget
                            uploadPreset="thulasi_preset"
                            options={{
                                maxFiles: 3,
                                sources: ['local', 'camera'],
                                clientAllowedFormats: ['image'],
                                maxFileSize: 5000000, // 5MB
                            }}
                            onSuccess={(result: any) => {
                                if (result?.info?.secure_url) {
                                    setImages([...images, result.info.secure_url]);
                                    toast.success('Photo uploaded!');
                                }
                            }}
                            onError={() => {
                                toast.error('Upload failed. Please try again.');
                            }}
                        >
                            {({ open }: { open: any }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="flex-1 bg-white border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl px-4 py-3 text-xs font-bold text-gray-500 hover:text-orange-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Photo Proof</span>
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-2 italic">* Visual proof establishes you as a true "Thulasi Woman" curator.</p>
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
