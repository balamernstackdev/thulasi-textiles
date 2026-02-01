'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X, Send, MessageSquare, Sparkles, Loader2, Minus, Maximize2 } from 'lucide-react';
import { askHeritageAssistant } from '@/lib/actions/ai';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatProductCard from './ChatProductCard';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIHeritageAssistant() {
    const params = useParams();
    const productId = params?.slug as string; // We'll try to get product info from slug if on product page

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Namaste! I am your **Thulasi Heritage Assistant**. \n\nHow can I help you discover the perfect weave today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const result = await askHeritageAssistant(userMessage, productId);
            if (result.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.data as string }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered a slight technical hitch. Please ask me again.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection lost. I am still here, please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to extract product slugs and render parts
    const renderMessageContent = (content: string) => {
        const productRegex = /\[PRODUCT:([\w-]+)\]/g;
        const parts = content.split(productRegex);
        const elements = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // Text part
                if (parts[i].trim()) {
                    elements.push(
                        <ReactMarkdown key={`text-${i}`} remarkPlugins={[remarkGfm]}>
                            {parts[i]}
                        </ReactMarkdown>
                    );
                }
            } else {
                // Product part
                elements.push(<ChatProductCard key={`prod-${i}`} slug={parts[i]} />);
            }
        }

        return elements;
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-orange-600 transition-all z-50 group active:scale-95"
            >
                <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce uppercase tracking-widest">Expert</div>
                <Bot className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-8 right-8 w-[380px] sm:w-[420px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col z-50 transition-all duration-500 overflow-hidden ${isMinimized ? 'h-20' : 'h-[600px]'}`}>
            {/* Header */}
            <div className="bg-black p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">Heritage Assistant</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Active Concierge</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/40 hover:text-white transition-colors">
                        {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-orange-600 text-white rounded-tr-none shadow-lg font-medium'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                                    }`}>
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm prose-orange max-w-none prose-p:leading-relaxed prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0 font-medium">
                                            {renderMessageContent(msg.content)}
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                    <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about fabrics, weaves, or occasions..."
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-600 rounded-2xl px-6 py-4 pr-16 outline-none transition-all font-bold text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all disabled:opacity-30 disabled:hover:bg-black"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button onClick={() => setInput("How to care for silk?")} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-gray-100 transition-all">Fabric Care</button>
                            <button onClick={() => setInput("What's a Kanchipuram weave?")} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-gray-100 transition-all">Weave Knowledge</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


