import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export default function StoryCard({ story }: { story: any }) {
    return (
        <Link href={`/stories/${story.slug}`} className="group block h-full">
            <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-orange-100 h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={story.coverImage || '/placeholder-story.jpg'}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                            {story.publishedAt ? format(new Date(story.publishedAt), 'MMM dd') : 'Draft'}
                        </p>
                    </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-orange-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Heritage Chronicles</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors italic uppercase tracking-tight line-clamp-2">
                            {story.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                            {story.excerpt}
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {story.author}
                        </span>
                        <span className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
