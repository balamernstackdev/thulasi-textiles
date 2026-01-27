'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Save, ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { upsertStory } from '@/lib/actions/story';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function StoryForm({ story }: { story?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState(story?.title || '');
    const [slug, setSlug] = useState(story?.slug || '');
    const [excerpt, setExcerpt] = useState(story?.excerpt || '');
    const [content, setContent] = useState(story?.content || '');
    const [coverImage, setCoverImage] = useState(story?.coverImage || '');
    const [author, setAuthor] = useState(story?.author || 'Thulasi Editor');
    const [tags, setTags] = useState(story?.tags || '');
    const [isPublished, setIsPublished] = useState(story?.isPublished || false);

    // Auto-generate slug from title if slug is empty
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        if (!story) { // Only auto-generate for new stories or if simpler
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await upsertStory({
                id: story?.id,
                title,
                slug,
                excerpt,
                content,
                coverImage,
                author,
                tags,
                isPublished
            }); // Cast to Partial<Story> happens implicitly or by arg type

            if (result.success) {
                toast.success(story ? 'Story updated' : 'Story created');
                router.push('/admin/stories');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to save story');
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="rounded-xl hover:bg-gray-100 p-2">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                            {story ? 'Edit Story' : 'New Story'}
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {story ? 'Update existing content' : 'Draft a new heritage chronicle'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-black hover:bg-orange-600 text-white px-8 py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                {story ? 'Save Changes' : 'Publish Story'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                className="w-full text-2xl font-black text-gray-900 placeholder:text-gray-200 border-none outline-none focus:ring-0 p-0"
                                placeholder="Enter a captivating title..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Slug URL</label>
                            <div className="flex items-center gap-1 bg-gray-50 px-4 py-3 rounded-xl">
                                <span className="text-xs text-gray-400 font-medium">thulasitextiles.com/stories/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="flex-1 bg-transparent text-xs font-bold text-gray-900 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Excerpt (SEO Description)</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={3}
                            className="w-full text-sm font-medium text-gray-600 placeholder:text-gray-300 border-none outline-none focus:ring-0 resize-none p-0 leading-relaxed"
                            placeholder="A brief summary that appears in search results and cards..."
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm min-h-[500px] flex flex-col">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Story Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 w-full text-base font-serif leading-loose text-gray-900 placeholder:text-gray-200 border-none outline-none focus:ring-0 resize-none p-0"
                            placeholder="Start writing your heritage story here... (Markdown supported)"
                        />
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-4 text-right">Markdown Supported</p>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Publishing Status */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Published</span>
                            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isPublished ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                <input
                                    type="checkbox"
                                    checked={isPublished}
                                    onChange={(e) => setIsPublished(e.target.checked)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </label>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Cover Image</label>

                        {coverImage ? (
                            <div className="relative aspect-video rounded-2xl overflow-hidden group shadow-md">
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCoverImage('')}
                                        className="bg-white text-rose-500 p-2 rounded-xl hover:scale-110 transition-transform"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <CldUploadWidget
                                signatureEndpoint="/api/cloudinary/sign"
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'our-products'}
                                onSuccess={(result: any) => {
                                    if (result.info?.secure_url) {
                                        setCoverImage(result.info.secure_url);
                                    }
                                }}
                            >
                                {({ open }: { open: any }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all gap-2"
                                    >
                                        <ImageIcon className="w-8 h-8" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Cover</span>
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Author</label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none"
                                placeholder="silk, heritage, history..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
