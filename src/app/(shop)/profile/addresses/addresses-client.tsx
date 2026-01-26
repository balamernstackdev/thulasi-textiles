'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Trash, Star, ArrowLeft, Edit, Phone } from 'lucide-react';
import { createAddress, deleteAddress, setDefaultAddress, updateAddress } from '@/lib/actions/address';
import { useRouter } from 'next/navigation';

type Address = {
    id: string;
    name: string;
    phone?: string | null;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
};

export default function AddressesClient({ addresses }: { addresses: Address[] }) {
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            let res;
            if (editingAddress) {
                res = await updateAddress(editingAddress.id, formData);
            } else {
                res = await createAddress(formData);
            }

            if (!res.success) {
                throw new Error(res.error || 'Operation failed');
            }

            setIsFormOpen(false);
            setEditingAddress(null);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save address');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            await deleteAddress(id);
            router.refresh();
        }
    };

    const handleSetDefault = async (id: string) => {
        await setDefaultAddress(id);
        router.refresh();
    };

    const openEdit = (address: Address) => {
        setEditingAddress(address);
        setIsFormOpen(true);
    };

    return (
        <div className="min-h-screen py-12 px-4 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-black font-bold uppercase text-[10px] tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Profile
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Addresses</h1>
                            <p className="text-gray-500 font-bold">Manage your delivery locations</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingAddress(null);
                                setIsFormOpen(true);
                            }}
                            className="bg-black text-white px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add New
                        </button>
                    </div>
                </div>

                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tighter italic">
                                {editingAddress ? 'Edit Address' : 'New Address'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <input name="name" defaultValue={editingAddress?.name} placeholder="Full Name" required className="px-6 py-4 rounded-2xl border border-gray-100 focus:border-orange-600 outline-none font-bold bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300 text-gray-900" />
                                    <input name="phone" defaultValue={editingAddress?.phone || ""} placeholder="Phone Number" required className="px-6 py-4 rounded-2xl border border-gray-100 focus:border-orange-600 outline-none font-bold bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300 text-gray-900" />
                                </div>
                                <input name="street" defaultValue={editingAddress?.street} placeholder="Street Address" required className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-orange-600 outline-none font-bold bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300 text-gray-900" />
                                <div className="grid grid-cols-2 gap-5">
                                    <input name="city" defaultValue={editingAddress?.city} placeholder="City" required className="px-6 py-4 rounded-2xl border border-gray-100 focus:border-orange-600 outline-none font-bold bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300 text-gray-900" />
                                    <input name="state" defaultValue={editingAddress?.state} placeholder="State" required className="px-6 py-4 rounded-2xl border border-gray-100 focus:border-orange-600 outline-none font-bold bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300 text-gray-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <input name="zip" defaultValue={editingAddress?.zip} placeholder="ZIP Code" required className="px-6 py-4 rounded-2xl border border-gray-100 focus:border-orange-600 outline-none font-bold bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300 text-gray-900" />
                                    <input name="country" defaultValue={editingAddress?.country || "India"} placeholder="Country" required className="px-6 py-4 rounded-2xl border border-gray-100 focus:border-orange-600 outline-none font-bold bg-gray-50/50 focus:bg-white transition-all placeholder:text-gray-300 text-gray-900" />
                                </div>
                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isDefault"
                                                value="true"
                                                defaultChecked={editingAddress?.isDefault}
                                                className="peer w-6 h-6 rounded-lg border-2 border-gray-200 checked:bg-orange-600 checked:border-orange-600 transition-all appearance-none cursor-pointer"
                                            />
                                            <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                        </div>
                                        <span className="font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Set as default address</span>
                                    </label>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="flex-1 px-8 py-5 border border-gray-200 rounded-2xl font-black text-gray-900 hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-orange-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address.id} className={`bg-white rounded-[2rem] p-6 shadow-md transition-all hover:shadow-xl relative group ${address.isDefault ? 'ring-2 ring-orange-100' : ''}`}>
                            {address.isDefault && (
                                <div className="absolute top-6 right-6 text-orange-600">
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{address.name}</h3>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{address.city}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6 pl-14">
                                {address.street}<br />
                                {address.city}, {address.state} - {address.zip}<br />
                                {address.country}
                                {address.phone && (
                                    <>
                                        <br />
                                        <span className="inline-flex items-center gap-1.5 mt-2 text-gray-400 font-bold">
                                            <Phone className="w-3 h-3" />
                                            {address.phone}
                                        </span>
                                    </>
                                )}
                            </p>

                            <div className="flex items-center gap-2 pl-14 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => openEdit(address)}
                                    className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                {!address.isDefault && (
                                    <>
                                        <button
                                            onClick={() => handleDelete(address.id)}
                                            className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="ml-auto text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors"
                                        >
                                            Set Default
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && (
                        <div className="md:col-span-2 text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium mb-4">No addresses saved yet</p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="text-orange-600 font-black uppercase text-xs tracking-widest hover:underline"
                            >
                                Add your first address
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
