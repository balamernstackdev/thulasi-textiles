'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Shop Error:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#F2F2F2]">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-50 rounded-3xl text-orange-600 mb-4">
                    <AlertTriangle className="w-12 h-12" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                        Something went <span className="text-orange-600">Wrong</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg leading-relaxed">
                        We encountered a heritage hitch. The loom might be temporarily stuck, or we're experiencing a connection issue.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-3 bg-orange-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl active:scale-95 w-full sm:w-auto"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Try Re-weaving
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 w-full sm:w-auto"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>

                {process.env.NODE_ENV !== 'production' && (
                    <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 text-left overflow-auto">
                        <p className="text-xs font-mono text-red-600 overflow-hidden text-ellipsis">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-[10px] font-mono text-red-400 mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
