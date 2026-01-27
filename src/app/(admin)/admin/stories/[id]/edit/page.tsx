
import StoryForm from '@/components/admin/StoryForm';
import { getStoryBySlug, getStories } from '@/lib/actions/story';
import prismadb from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // We fetch directly via prisma to get by ID, since action uses slug for public view mainly
    // Re-using prisma directly here for admin ease or update action
    const story = await prismadb.story.findUnique({
        where: { id }
    });

    if (!story) {
        notFound();
    }

    return <StoryForm story={story} />;
}
