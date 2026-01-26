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
            toast.success('Settings updated successfully');
            // Optimistic update
            const newSettings: any = {};
            formData.forEach((value, key) => { newSettings[key] = value });
            setSettings({ ...settings, ...newSettings });
        } else {
            toast.error('Failed to update settings');
        }
    }

    if (loading) {
        return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Store Configuration</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage global store defaults</p>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-8">
                {/* General Info */}
                <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-50 transition-colors duration-500" />

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Settings className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">General Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store Name</label>
                            <input
                                name="storeName"
                                defaultValue={settings?.storeName}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                placeholder="e.g. Thulasi Textiles"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Currency Code</label>
                            <input
                                name="currency"
                                defaultValue={settings?.currency || 'INR'}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                placeholder="e.g. INR"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Support Email</label>
                            <input
                                name="supportEmail"
                                type="email"
                                defaultValue={settings?.supportEmail}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                placeholder="support@domain.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Support Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="supportPhone"
                                    defaultValue={settings?.supportPhone}
                                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-0 rounded-xl pl-12 pr-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEO Settings */}
                <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors duration-500" />

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">SEO Defaults</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Default Meta Title</label>
                            <input
                                name="seoTitle"
                                defaultValue={settings?.seoTitle}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                placeholder="Thulasi Textiles | Authentic Handloom"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Default Meta Description</label>
                            <textarea
                                name="seoDescription"
                                rows={3}
                                defaultValue={settings?.seoDescription}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300 resize-none"
                                placeholder="Discover the finest collection of..."
                            />
                        </div>
                    </div>
                </section>

                {/* Social Media */}
                <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-50 transition-colors duration-500" />

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">Social Connections</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instagram</label>
                            <input
                                name="socialInstagram"
                                defaultValue={settings?.socialInstagram}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                placeholder="@username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Facebook</label>
                            <input
                                name="socialFacebook"
                                defaultValue={settings?.socialFacebook}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                placeholder="facebook.com/page"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Twitter / X</label>
                            <input
                                name="socialTwitter"
                                defaultValue={settings?.socialTwitter}
                                className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-purple-500 focus:ring-0 rounded-xl px-4 py-3 font-bold text-gray-900 transition-all placeholder:text-gray-300"
                                placeholder="@handle"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
