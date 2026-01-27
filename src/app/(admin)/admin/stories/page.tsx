import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Search, FileText } from 'lucide-react';
import { getStories } from '@/lib/actions/story';
import DeleteStoryButton from '@/components/admin/DeleteStoryButton';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function StoriesPage({
    searchParams
}: {
    searchParams: Promise<{
        page?: string,
        q?: string,
        status?: string
    }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const query = params.q || '';
    const publishedOnly = params.status === 'published';

    const { success, data: stories = [] } = await getStories({
        page,
        limit: 20,
        search: query,
        publishedOnly
    });

    const storyList = Array.isArray(stories) ? stories : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Heritage Stories</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage your blog & editorial content</p>
                </div>
                <Link href="/admin/stories/new" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-[#2dd4bf] text-[#1e293b] hover:bg-[#2dd4bf]/90 font-black text-[10px] uppercase tracking-widest px-8 py-6 sm:py-2.5 rounded-xl shadow-lg shadow-teal-500/20">
                        <Plus className="w-4 h-4 mr-2" /> Write Story
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-[#f8fafc]/50 border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Title</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Author</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Published Date</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {storyList?.map((story: any) => (
                                <tr key={story.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0 relative overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                                {story.coverImage ? (
                                                    <img
                                                        src={story.coverImage}
                                                        alt={story.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-teal-600 transition-colors text-sm">{story.title}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[200px]">{story.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-gray-700">
                                            {story.author || 'Thulasi Editor'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${story.isPublished
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {story.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            {story.publishedAt ? format(new Date(story.publishedAt), 'MMM dd, yyyy') : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/stories/${story.id}/edit`}
                                                className="text-gray-300 hover:text-emerald-500 p-3 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <DeleteStoryButton id={story.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!storyList || storyList.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="font-black text-gray-900 uppercase tracking-widest text-xs">No stories found</p>
                                            <Link href="/admin/stories/new" className="mt-4 text-teal-600 text-[10px] font-black uppercase tracking-widest hover:underline">Write your first story</Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
