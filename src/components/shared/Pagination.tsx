'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const url = new URL(baseUrl, 'http://dummy.com');
        url.searchParams.set('page', page.toString());
        return url.pathname + url.search;
    };

    return (
        <div className="flex items-center justify-between border-b border-gray-100 bg-white/50 backdrop-blur-md px-4 py-3 sm:px-6 mt-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100">
            <div className="flex flex-1 justify-between sm:hidden items-center">
                <Link
                    href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
                    className={`relative inline-flex items-center rounded-xl bg-white px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm border border-gray-100 hover:bg-orange-600 hover:text-white transition-all active:scale-95 ${currentPage <= 1 ? 'pointer-events-none opacity-40' : 'hover:-translate-x-1'}`}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Link>
                <Link
                    href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
                    className={`relative inline-flex items-center rounded-xl bg-white px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm border border-gray-100 hover:bg-orange-600 hover:text-white transition-all active:scale-95 ${currentPage >= totalPages ? 'pointer-events-none opacity-40' : 'hover:translate-x-1'}`}
                >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        Showing page <span className="font-black text-gray-900">{currentPage}</span> of <span className="font-black text-gray-900">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex gap-2" aria-label="Pagination">
                        <Link
                            href={currentPage > 1 ? createPageUrl(currentPage - 1) : '#'}
                            className={`relative inline-flex items-center rounded-xl px-3 py-2 text-gray-400 hover:bg-orange-600 hover:text-white transition-all duration-300 ${currentPage <= 1 ? 'pointer-events-none opacity-20' : 'hover:-translate-x-1'}`}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </Link>

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            const isCurrent = pageNum === currentPage;

                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <Link
                                        key={pageNum}
                                        href={createPageUrl(pageNum)}
                                        aria-current={isCurrent ? 'page' : undefined}
                                        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-xs font-black transition-all duration-300 active:scale-95 ${isCurrent ? 'z-10 bg-orange-600 text-white shadow-[0_10px_20px_-5px_rgba(234,88,12,0.4)]' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            } else if (
                                pageNum === currentPage - 2 ||
                                pageNum === currentPage + 2
                            ) {
                                return (
                                    <span key={pageNum} className="relative inline-flex items-center px-4 py-2 text-[10px] font-black text-gray-300 tracking-widest">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}

                        <Link
                            href={currentPage < totalPages ? createPageUrl(currentPage + 1) : '#'}
                            className={`relative inline-flex items-center rounded-xl px-3 py-2 text-gray-400 hover:bg-orange-600 hover:text-white transition-all duration-300 ${currentPage >= totalPages ? 'pointer-events-none opacity-20' : 'hover:translate-x-1'}`}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
