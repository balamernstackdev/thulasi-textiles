
import { getStories } from '@/lib/actions/story';
import StoryCard from '@/components/shop/StoryCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Heritage Stories | Thulasi Textiles',
    description: 'Explore the legacy of Indian craftsmanship, weaving traditions, and the stories behind our master artisans.',
};

export const revalidate = 60; // Revalidate every minute

export default async function StoriesIndexPage() {
    const { data: stories } = await getStories({
        publishedOnly: true,
        limit: 50
    });

    const storyList = Array.isArray(stories) ? stories : [];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Hero */}
            <div className="relative bg-gray-900 text-white overflow-hidden py-24 lg:py-32">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1606913084603-3e7702b01627?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Loom" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900" />

                <div className="relative z-10 max-w-[1700px] mx-auto px-6 lg:px-20 text-center">
                    <span className="inline-block px-4 py-2 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-fade-in-up">
                        The Thulasi Journal
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                        Heritage <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Stories</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
                        Dive deep into the rich tapestry of Indian textiles. Discover the history, the hands, and the heart behind every weave.
                    </p>
                </div>
            </div>

            <div className="max-w-[1700px] mx-auto px-6 lg:px-20 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {storyList.map((story: any) => (
                        <StoryCard key={story.id} story={story} />
                    ))}
                    {storyList.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem]">
                            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No stories published yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
