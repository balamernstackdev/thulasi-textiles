import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Category } from '@prisma/client';

interface MegaMenuProps {
    category: Category & { children: Category[] };
    onClick?: () => void;
}

export default function MegaMenu({ category, onClick }: MegaMenuProps) {
    if (!category.children || category.children.length === 0) return null;

    // Split children into columns if there are many, or just list them
    // For now, we'll take up to 8-10 subcategories
    const subcategories = category.children.slice(0, 10);

    return (
        <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[600px] lg:w-[800px] bg-white rounded-3xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] border border-gray-100 p-6 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500" />

            <div className="flex gap-8">

                {/* Left Column: Subcategories */}
                <div className="flex-1 min-w-0 py-2">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            Explore {category.name}
                        </h3>
                        <Link
                            href={`/category/${category.slug}`}
                            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider flex items-center gap-1"
                            onClick={onClick}
                        >
                            View All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {subcategories.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/category/${sub.slug}`}
                                className="group flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 transition-all"
                                onClick={onClick}
                            >
                                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {sub.name}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Column: Featured Visual */}
                <div className="w-[280px] shrink-0">
                    <Link href={`/category/${category.slug}`} onClick={onClick} className="block group relative h-full rounded-2xl overflow-hidden bg-gray-100">
                        {category.image ? (
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-300">
                                <span className="font-black text-4xl opacity-20 uppercase">{category.name[0]}</span>
                            </div>
                        )}

                        {/* Overlay Content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                            <span className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">Featured Collection</span>
                            <h4 className="text-white text-xl font-black uppercase tracking-tight leading-none group-hover:underline decoration-2 decoration-orange-500 underline-offset-4">
                                {category.name}
                            </h4>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
