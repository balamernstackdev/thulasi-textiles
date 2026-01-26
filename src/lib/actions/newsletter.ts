'use server';

import prismadb from '@/lib/prisma';

export async function subscribeNewsletter(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please provide a valid email address.' };
    }

    try {
        // Here you would typically integrate with Mailchimp/SendGrid
        // For now, we'll just log it or potentially store it in a dedicated model if it existed
        console.log(`Newsletter subscription request: ${email}`);

        // Mock success for now
        return { success: true, message: 'Thank you for subscribing!' };
    } catch (error) {
        console.error('Newsletter error:', error);
        return { success: false, error: 'Something went wrong. Please try again later.' };
    }
}
