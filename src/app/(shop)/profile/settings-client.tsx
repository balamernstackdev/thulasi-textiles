'use client';

import { useState } from 'react';
import { User, Lock, Mail, Save, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsClient({ session }: { session: any }) {
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: session.user.name || '',
        email: session.user.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Profile updated successfully');
            } else {
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/user/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Password updated successfully');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(data.error || 'Failed to update password');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight italic mb-2">
                    Account Settings
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                    Manage your profile information and security
                </p>
            </div>

            {/* Profile Information */}
            <form onSubmit={handleProfileUpdate} className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Profile Information</h4>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full bg-white border-2 border-gray-200 focus:border-blue-600 focus:ring-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full bg-white border-2 border-gray-200 focus:border-blue-600 focus:ring-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Password Update */}
            <form onSubmit={handlePasswordUpdate} className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">Change Password</h4>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full bg-white border-2 border-gray-200 focus:border-orange-600 focus:ring-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full bg-white border-2 border-gray-200 focus:border-orange-600 focus:ring-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full bg-white border-2 border-gray-200 focus:border-orange-600 focus:ring-0 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Update Password
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Account Info */}
            <div className="bg-green-50 rounded-3xl p-6 sm:p-8 border border-green-100">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-green-900 uppercase tracking-tight mb-1">Account Status</h4>
                        <p className="text-xs text-green-700 font-medium">
                            Your account is active and secure. All changes are saved automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
