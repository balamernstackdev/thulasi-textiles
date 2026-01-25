
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500">Configure your store settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">General Information</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                            <input type="text" className="w-full border rounded-lg p-2" defaultValue="Textiles Store" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                            <input type="email" className="w-full border rounded-lg p-2" defaultValue="support@textiles.com" />
                        </div>
                        <Button>Save Changes</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
