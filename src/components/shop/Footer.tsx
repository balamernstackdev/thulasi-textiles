'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, ChevronRight } from 'lucide-react';
import { Category } from '@prisma/client';

export default function Footer({ categories }: { categories: any[] }) {
    return (
        <footer className="bg-[#131921] text-white pt-12 pb-6 mt-12">
            <div className="max-w-[1700px] mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand & Contact */}
                    <div className="space-y-6">
                        <Link href="/" className="flex flex-col items-center lg:items-start gap-4 group">
                            <div className="bg-white p-2 rounded-full shadow-2xl animate-pulse [animation-duration:5s]">
                                <Image
                                    src="/logo.png"
                                    alt="Thulasi Textiles Logo"
                                    width={100}
                                    height={40}
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                            <div className="flex flex-col leading-none text-center lg:text-left">
                                <span className="text-xl font-black tracking-tighter uppercase italic block">
                                    <span className="text-gray-400">Thulasi</span> <span className="text-orange-600">Textiles</span>
                                </span>
                                <span className="text-[9px] font-black text-orange-600 tracking-[0.3em] uppercase mt-1">Women's World</span>
                            </div>
                        </Link>

                        <p className="text-sm text-gray-400 leading-relaxed">
                            Experience the finest collection of premium textiles, sarees, and fashion wear. Quality and tradition woven into every thread.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>123 Textile Plaza, Fashion Street,<br />Salem, Tamil Nadu - 636001</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>support@thulasitextiles.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Categories */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Our Collections</h4>
                        <ul className="grid grid-cols-1 gap-3">
                            {categories.filter(c => !c.parentId).map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className="text-gray-400 hover:text-orange-500 transition-colors text-sm flex items-center group"
                                    >
                                        <ChevronRight className="w-3 h-3 mr-2 text-orange-600 opacity-0 group-hover:opacity-100 transition-all" />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Customer Care</h4>
                        <ul className="space-y-3">
                            <li><Link href="/profile" className="text-gray-400 hover:text-orange-500 text-sm">My Account</Link></li>
                            <li><Link href="/orders" className="text-gray-400 hover:text-orange-500 text-sm">Order Tracking</Link></li>
                            {/* <li><Link href="/signup" className="text-gray-400 hover:text-orange-500 text-sm">Join Membership</Link></li> */}
                            <li><Link href="/privacy-policy" className="text-gray-400 hover:text-orange-500 text-sm">Privacy Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="text-gray-400 hover:text-orange-500 text-sm">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Social */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Stay Connected</h4>
                        <p className="text-sm text-gray-400">Subscribe for exclusive offers and new arrivals.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-gray-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-orange-500 outline-none"
                            />
                            <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-r-lg font-bold text-sm transition-colors">
                                Join
                            </button>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-600 transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} <span className="text-gray-300 font-bold">Thulasi Textiles</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Image src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=100&q=80" alt="Payment Methods" width={150} height={30} className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
