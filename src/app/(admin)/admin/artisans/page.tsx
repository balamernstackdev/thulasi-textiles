'use client';

import { useState, useEffect, useCallback } from 'react';
import { getArtisans, deleteArtisan } from '@/lib/actions/artisan';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    MapPin,
    Award,
    Loader2,
    XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ArtisanListPage() {
    const [loading, setLoading] = useState(true);
    const [artisans, setArtisans] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    const fetchArtisans = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getArtisans();
            if (res.success) setArtisans(res.data);
        } catch (error) {
            toast.error("Failed to load artisans");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArtisans();
    }, [fetchArtisans]);

    const filteredArtisans = artisans.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.specialty?.toLowerCase().includes(search.toLowerCase()) ||
        a.village?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this artisan? This will fail if they are linked to products.')) return;

        try {
            const res = await deleteArtisan(id);
            if (res.success) {
                toast.success('Artisan deleted successfully');
                fetchArtisans();
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Artisan Collective</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Artisan Collective</h1>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Manage the masters behind the weave</p>
                </div>
                <Link href="/admin/artisans/new">
                    <Button className="h-12 px-6 rounded-2xl bg-black text-white hover:bg-orange-600 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/10 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Artisan
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    placeholder="Search by name, specialty, or village..."
                    className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-14 pr-6 text-sm font-bold shadow-sm focus:border-orange-400 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtisans.map((artisan) => (
                    <div key={artisan.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                        <div className="aspect-[16/9] relative bg-gray-50 overflow-hidden">
                            {artisan.imageUrl ? (
                                <img src={artisan.imageUrl} alt={artisan.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Users className="w-12 h-12 text-gray-100" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Link href={`/admin/artisans/${artisan.id}`}>
                                    <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-gray-600 hover:text-black shadow-sm transition-all hover:scale-105">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(artisan.id)}
                                    className="w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-red-400 hover:text-red-600 shadow-sm transition-all hover:scale-105"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">{artisan.name}</h3>
                                <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-0.5">{artisan.specialty || 'Master Weaver'}</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{artisan.village || 'Heritage Hub'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{artisan.experienceYears || '15+'} Yrs Exp.</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Products</span>
                                    <p className="text-xs font-black text-gray-900">{artisan._count.products}</p>
                                </div>
                                <Link href={`/admin/artisans/${artisan.id}`} className="text-[9px] font-black uppercase text-gray-400 hover:text-orange-600 tracking-widest transition-colors">
                                    View Full Dossier →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredArtisans.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center">
                    <XCircle className="w-16 h-16 text-gray-100 mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No artisans found in matrix</p>
                </div>
            )}
        </div>
    );
}
