'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-xl w-full text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6">
                    <AlertCircle className="w-10 h-10" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard Error</h1>
                <p className="text-gray-500 mb-8">
                    We encountered an error while loading the management interface. This might be due to a database connection issue.
                </p>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => reset()}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 rounded-xl"
                    >
                        <RefreshCcw className="w-5 h-5 mr-2" />
                        Retry Connection
                    </Button>

                    <Link href="/admin">
                        <Button
                            variant="outline"
                            className="w-full py-6 rounded-xl text-gray-600 border-gray-200"
                        >
                            <LayoutDashboard className="w-5 h-5 mr-2" />
                            Reset Dashboard
                        </Button>
                    </Link>
                </div>

                {process.env.NODE_ENV !== 'production' && (
                    <div className="mt-8 text-left">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Debug Info</p>
                        <pre className="p-4 bg-gray-900 text-gray-300 rounded-xl text-xs overflow-auto font-mono max-h-40">
                            {error.message}
                            {error.digest && `\nDigest: ${error.digest}`}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
