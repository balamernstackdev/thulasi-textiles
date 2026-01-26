'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/actions/order';
import { toast } from 'sonner';
import { Shield, User, Loader2 } from 'lucide-react';

interface RoleSelectorProps {
    userId: string;
    currentRole: 'ADMIN' | 'CUSTOMER';
}

export default function RoleSelector({ userId, currentRole }: RoleSelectorProps) {
    const [loading, setLoading] = useState(false);

    const handleRoleChange = async (newRole: 'ADMIN' | 'CUSTOMER') => {
        if (newRole === currentRole) return;

        setLoading(true);
        try {
            const result = await updateUserRole(userId, newRole);
            if (result.success) {
                toast.success(`User role updated to ${newRole}`);
            } else {
                toast.error(result.error || 'Failed to update user role');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 w-fit">
            <button
                disabled={loading}
                onClick={() => handleRoleChange('CUSTOMER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentRole === 'CUSTOMER'
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                <User className="w-3 h-3" />
                Customer
            </button>
            <button
                disabled={loading}
                onClick={() => handleRoleChange('ADMIN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentRole === 'ADMIN'
                        ? 'bg-[#2dd4bf] text-white shadow-lg shadow-teal-500/20'
                        : 'text-gray-400 hover:text-teal-500'
                    }`}
            >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                Admin
            </button>
        </div>
    );
}
