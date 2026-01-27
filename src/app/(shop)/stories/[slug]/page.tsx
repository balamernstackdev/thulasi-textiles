
import { getStoryBySlug } from '@/lib/actions/story';
import { notFound } from 'next/navigation';
import DatePill from '@/components/shop/DatePill';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: story } = await getStoryBySlug(slug);

    if (!story) return { title: 'Story Not Found' };

    return {
        title: `${story.title} | Heritage Stories`,
        description: story.excerpt,
        openGraph: {
            images: story.coverImage ? [story.coverImage] : []
        }
    };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: story } = await getStoryBySlug(slug);

    if (!story || (!story.isPublished && process.env.NODE_ENV === 'production')) {
        notFound();
    }

    return (
        <article className="bg-white min-h-screen pb-20">
            {/* Progress Bar (Simulated) */}
            <div className="fixed top-0 left-0 w-full h-1 z-50">
                <div className="h-full bg-orange-600 w-1/3" />
            </div>

            {/* Hero Header */}
            <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
                <img
                    src={story.coverImage || '/placeholder-story.jpg'}
                    alt={story.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-8 left-0 w-full px-6 lg:px-20 z-20 flex justify-between items-start">
                    <Link href="/stories" className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-black transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full px-6 lg:px-20 pb-12 lg:pb-20 z-20 max-w-5xl">
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                            Heritage Chronicle
                        </span>
                        {story.tags && story.tags.split(',').map((tag: string) => (
                            <span key={tag} className="text-gray-300 text-xs font-bold uppercase tracking-widest">
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 uppercase italic tracking-tight">
                        {story.title}
                    </h1>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl font-black text-gray-900 border-2 border-orange-500">
                                {story.author ? story.author[0] : 'T'}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{story.author || 'Thulasi Editor'}</p>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Words & Curation</p>
                            </div>
                        </div>
                        {story.publishedAt && (
                            <>
                                <div className="h-8 w-px bg-white/20" />
                                <DatePill date={story.publishedAt} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-6 lg:px-0 -mt-10 relative z-30">
                <div className="bg-white p-8 md:p-12 lg:p-16 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
                    <p className="text-xl md:text-2xl font-serif text-gray-500 italic leading-relaxed mb-12 border-l-4 border-orange-600 pl-6">
                        {story.excerpt}
                    </p>

                    <div className="prose prose-lg prose-gray max-w-none">
                        {/* Simple whitespace rendering for now */}
                        {story.content.split('\n').map((paragraph: string, idx: number) => (
                            paragraph.trim() ? (
                                <p key={idx} className="mb-6 text-gray-800 leading-8 font-medium">
                                    {paragraph}
                                </p>
                            ) : <br key={idx} />
                        ))}
                    </div>

                    <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Share this story</p>
                        <button className="flex items-center gap-2 text-gray-900 font-bold hover:text-orange-600">
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
