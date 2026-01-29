import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArtisanForm from '@/components/admin/ArtisanForm';

export default function NewArtisanPage() {
    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-20">
            <div className="flex items-center gap-6">
                <Link href="/admin/artisans">
                    <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Register Master</h1>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Add a new artisan to the heritage collective</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                <ArtisanForm />
            </div>
        </div>
    );
}
