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
            className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto bg-white/10 p-2.5 rounded-[4rem] backdrop-blur-[2px]"
        >
            <input
                type="email"
                name="email"
                required
                placeholder="Your best email..."
                className="flex-[1.5] px-10 py-6 rounded-full font-bold bg-white text-gray-900 focus:outline-none shadow-sm disabled:opacity-50 placeholder:text-gray-400 placeholder:font-semibold"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-zinc-900 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm md:text-base"
            >
                {isLoading ? 'Joining...' : 'SUBSCRIBE'}
            </button>
        </form>
    );
}
