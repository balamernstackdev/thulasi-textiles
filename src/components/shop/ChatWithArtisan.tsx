'use client';

import { MessageCircle } from 'lucide-react';
import { WhatsappService } from '@/lib/services/whatsapp';

export default function ChatWithArtisan({ productName }: { productName: string }) {
    const handleChat = () => {
        const message = `Namaste, I am interested in the "${productName}" and would like to know more about its weave and availability.`;
        const link = WhatsappService.generateChatLink(message);
        window.open(link, '_blank');
    };

    return (
        <button
            onClick={handleChat}
            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 group"
        >
            <MessageCircle className="w-4 h-4 fill-white" />
            <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Direct Connection</p>
                <p className="text-xs font-bold leading-none">Chat with Artisan</p>
            </div>
        </button>
    );
}
