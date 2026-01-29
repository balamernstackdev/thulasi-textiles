'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Settings, Save, Loader2, Globe, Share2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStoreSettings, updateStoreSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} type="submit" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 rounded-xl px-8 font-bold text-xs uppercase tracking-widest">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                </>
            )}
        </Button>
    );
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social'>('general');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            const result = await getStoreSettings();
            if (result.success) {
                setSettings(result.data);
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    async function handleSubmit(formData: FormData) {
        const result = await updateStoreSettings(formData);
        if (result.success) {
            toast.success('Configuration synced successfully');
            setIsDirty(false);
            const newSettings: any = {};
            formData.forEach((value, key) => { newSettings[key] = value });
            setSettings({ ...settings, ...newSettings });
        } else {
            toast.error('Failed to update core settings');
        }
    }

    if (loading) {
        return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Matrix Systems</p>
        </div>;
    }

    const tabs = [
        { id: 'general', label: 'Store Defaults', icon: Settings, color: 'text-orange-500', bgColor: 'bg-orange-50' },
        { id: 'seo', label: 'SEO Engine', icon: Globe, color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { id: 'social', label: 'Social Hub', icon: Share2, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    ];

    return (
        <div className="p-4 md:p-10 space-y-12 w-full pb-32">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">System Settings</h1>
                    <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-[0.4em] font-black">Configure your global heritage operations</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Encrypted Payload Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Vertical Tabs */}
                <div className="space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-300 group ${activeTab === tab.id
                                ? 'bg-white shadow-xl shadow-gray-200/50 border border-gray-100'
                                : 'hover:bg-gray-100/50 text-gray-400'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${activeTab === tab.id ? `${tab.bgColor} ${tab.color} shadow-lg` : 'bg-gray-100 text-gray-400 group-hover:bg-white'}`}>
                                <tab.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[11px] uppercase tracking-[0.2em] font-black ${activeTab === tab.id ? 'text-gray-900' : ''}`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Form Area */}
                <div className="lg:col-span-3">
                    <form action={handleSubmit} onChange={() => setIsDirty(true)} className="space-y-12">
                        {activeTab === 'general' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-[100px] -mr-32 -mt-32" />

                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Identity: Store Name</label>
                                            <input
                                                name="storeName"
                                                defaultValue={settings?.storeName}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                placeholder="e.g. Thulasi Textiles"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Market: Currency Code</label>
                                            <input
                                                name="currency"
                                                defaultValue={settings?.currency || 'INR'}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                placeholder="e.g. INR"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Channel: Support Email</label>
                                            <input
                                                name="supportEmail"
                                                type="email"
                                                defaultValue={settings?.supportEmail}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                placeholder="support@domain.com"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Channel: Support Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    name="supportPhone"
                                                    defaultValue={settings?.supportPhone}
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl pl-14 pr-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[100px] -mr-32 -mt-32" />
                                    <div className="relative z-10 space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Optimization: Default Meta Title</label>
                                            <input
                                                name="seoTitle"
                                                defaultValue={settings?.seoTitle}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                placeholder="Thulasi Textiles | Authentic Handloom"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Optimization: Default Meta Description</label>
                                            <textarea
                                                name="seoDescription"
                                                rows={4}
                                                defaultValue={settings?.seoDescription}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-3xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic resize-none leading-relaxed"
                                                placeholder="Discover the finest collection of..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Google Preview Shell */}
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Search Engine Matrix Preview
                                    </p>
                                    <div className="space-y-1 max-w-xl">
                                        <p className="text-[#1a0dab] text-xl hover:underline cursor-pointer truncate font-medium">
                                            {settings?.seoTitle || 'Thulasi Textiles | Authentic Handloom'}
                                        </p>
                                        <p className="text-[#006621] text-sm truncate">
                                            https://thulasitextiles.com
                                        </p>
                                        <p className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
                                            {settings?.seoDescription || 'Discover the most exquisite collection of handcrafted silk sarees and heritage textiles...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'social' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50/50 rounded-full blur-[100px] -mr-32 -mt-32" />
                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Growth: Instagram</label>
                                            <input
                                                name="socialInstagram"
                                                defaultValue={settings?.socialInstagram}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                placeholder="@thulasi_textiles"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Growth: Facebook</label>
                                            <input
                                                name="socialFacebook"
                                                defaultValue={settings?.socialFacebook}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                placeholder="thulasitextiles.official"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Growth: Twitter / X</label>
                                            <input
                                                name="socialTwitter"
                                                defaultValue={settings?.socialTwitter}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black focus:ring-0 rounded-2xl px-6 py-4 font-black text-gray-900 transition-all placeholder:text-gray-300 text-sm italic"
                                                placeholder="@thulasi_txtls"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sticky Action Bar */}
                        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 lg:left-[calc(50%+144px)] z-50 transition-all duration-500 transform ${isDirty ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                            <div className="bg-black text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 border border-white/20 backdrop-blur-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Unsaved Matrix Changes</p>
                                <div className="h-6 w-px bg-white/20" />
                                <SubmitButton />
                            </div>
                        </div>

                        {/* Visible Save Button when not dirty or on mobile */}
                        {!isDirty && (
                            <div className="flex justify-end pt-4 md:hidden">
                                <SubmitButton />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
