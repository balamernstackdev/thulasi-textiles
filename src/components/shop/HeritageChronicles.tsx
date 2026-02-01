
import { getStories } from '@/lib/actions/story';
import StoryCard from '@/components/shop/StoryCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function HeritageChronicles() {
    const { data: stories } = await getStories({ publishedOnly: true, limit: 3 });
    const storyList = Array.isArray(stories) ? stories : [];

    if (storyList.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
            <div className="max-w-[1700px] mx-auto px-6 lg:px-20">
                <div className="flex items-end justify-between mb-16 px-4">
                    <div>
                        <span className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block animate-pulse">The Thulasi Journal</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-none tracking-tighter uppercase italic">
                            Heritage <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Chronicles</span>
                        </h2>
                    </div>

                    <Link href="/stories" className="hidden md:flex items-center gap-2 group">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-orange-600 transition-colors">Read All Stories</span>
                        <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-all">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {storyList.map((story: any) => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/stories" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs">
                        View All Stories <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
