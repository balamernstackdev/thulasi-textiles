'use server';

import prismadb from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Story } from '@prisma/client';

export type StoryState = {
    success: boolean;
    error?: string;
    data?: Story | Story[];
};

/**
 * Fetch all stories with optional pagination and filtering
 */
export async function getStories({
    page = 1,
    limit = 10,
    publishedOnly = false,
    search = ''
}: {
    page?: number;
    limit?: number;
    publishedOnly?: boolean;
    search?: string;
} = {}) {
    try {
        const skip = (page - 1) * limit;

        const whereClause: any = {};

        if (publishedOnly) {
            whereClause.isPublished = true;
        }

        if (search) {
            whereClause.OR = [
                { title: { contains: search } },
                { content: { contains: search } },
            ];
        }

        const [stories, total] = await Promise.all([
            prismadb.story.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prismadb.story.count({ where: whereClause })
        ]);

        return {
            success: true,
            data: stories,
            metadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('[GET_STORIES_ERROR]', error);
        return { success: false, error: 'Failed to fetch stories' };
    }
}

/**
 * Fetch a single story by slug
 */
export async function getStoryBySlug(slug: string) {
    try {
        const story = await prismadb.story.findUnique({
            where: { slug }
        });

        if (!story) return { success: false, error: 'Story not found' };

        return { success: true, data: story };
    } catch (error) {
        console.error('[GET_STORY_ERROR]', error);
        return { success: false, error: 'Failed to fetch story' };
    }
}

/**
 * Create or Update a story
 */
export async function upsertStory(data: Partial<Story>) {
    try {
        const { id, title, slug, content, excerpt, coverImage, author, isPublished, tags } = data;

        if (!title || !slug) {
            return { success: false, error: 'Title and Slug are required' };
        }

        // Check for duplicate slug if creating or updating slug
        const existing = await prismadb.story.findUnique({ where: { slug } });
        if (existing && existing.id !== id) {
            return { success: false, error: 'Slug already exists' };
        }

        let story;
        if (id) {
            story = await prismadb.story.update({
                where: { id },
                data: {
                    title,
                    slug,
                    content,
                    excerpt: excerpt || '',
                    coverImage,
                    author,
                    isPublished,
                    tags,
                    publishedAt: isPublished ? (existing?.publishedAt || new Date()) : null
                }
            });
        } else {
            story = await prismadb.story.create({
                data: {
                    title,
                    slug,
                    content: content || '',
                    excerpt: excerpt || '',
                    coverImage,
                    author,
                    isPublished: isPublished || false,
                    tags,
                    publishedAt: isPublished ? new Date() : null
                }
            });
        }

        revalidatePath('/admin/stories');
        revalidatePath('/stories');
        return { success: true, data: story };

    } catch (error) {
        console.error('[UPSERT_STORY_ERROR]', error);
        return { success: false, error: 'Failed to save story' };
    }
}

/**
 * Delete a story
 */
export async function deleteStory(id: string) {
    try {
        await prismadb.story.delete({
            where: { id }
        });

        revalidatePath('/admin/stories');
        revalidatePath('/stories');
        return { success: true };
    } catch (error) {
        console.error('[DELETE_STORY_ERROR]', error);
        return { success: false, error: 'Failed to delete story' };
    }
}
