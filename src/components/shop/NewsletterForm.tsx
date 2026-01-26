'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { subscribeNewsletter } from '@/lib/actions/newsletter';

export default function NewsletterForm() {
    const [isLoading, setIsLoading] = useState(false);

    async function action(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await subscribeNewsletter(formData);
            if (result.success) {
                toast.success(result.message);
                (document.getElementById('newsletter-form') as HTMLFormElement)?.reset();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            id="newsletter-form"
            action={action}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/10 p-2 rounded-[3rem] backdrop-blur-md"
        >
            <input
                type="email"
                name="email"
                required
                placeholder="Your best email..."
                className="flex-1 px-8 py-5 rounded-full font-bold bg-white text-gray-900 focus:outline-none shadow-xl disabled:opacity-50"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
                {isLoading ? 'Joining...' : 'Subscribe'}
            </button>
        </form>
    );
}
