import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    return (
        <div className="relative w-full z-0 bg-white pb-8">
            {/* Background Hero Section */}
            <div className="container mx-auto px-8 lg:px-24 xl:px-40 pt-4">
                <div className="relative h-[250px] md:h-[350px] overflow-hidden rounded-[2.5rem] shadow-sm">
                    <Image
                        src="/placeholder-product.png"
                        alt="Hero Background"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center px-8 md:px-16 z-20 text-white">
                        <div className="max-w-lg">
                            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Summer Collection</h1>
                            <p className="font-bold text-sm md:text-base opacity-90 mb-6">Discover the hottest trends for the season with our handcrafted ethic wear.</p>
                            <Link href="/category/women" className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-orange-600 hover:text-white transition-colors">
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Cards Grid */}
            <div className="container mx-auto px-8 lg:px-24 xl:px-40 relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-12">

                {/* Card 1: Women's Ethnic */}
                <div className="bg-white p-5 shadow-xl rounded-xl group overflow-hidden">
                    <h2 className="text-xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">Women's Ethnic Wear</h2>
                    <div className="grid grid-cols-2 gap-3 aspect-square mb-4">
                        <div className="relative rounded-lg overflow-hidden bg-gray-50 h-full">
                            <Image src="/placeholder-product.png" alt="Sarees" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-black/40 text-white text-[10px] font-bold uppercase tracking-wider">Sarees</div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden bg-gray-50 h-full">
                            <Image src="/placeholder-product.png" alt="Kurtis" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-black/40 text-white text-[10px] font-bold uppercase tracking-wider">Kurtis</div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden bg-gray-50 h-full">
                            <Image src="/placeholder-product.png" alt="Lehengas" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-black/40 text-white text-[10px] font-bold uppercase tracking-wider">Lehengas</div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden bg-gray-50 h-full">
                            <Image src="/placeholder-product.png" alt="More" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-black/40 text-white text-[10px] font-bold uppercase tracking-wider">Explore All</div>
                        </div>
                    </div>
                    <Link href="/category/women" className="text-orange-600 hover:underline text-sm font-bold flex items-center gap-2">
                        View Collection →
                    </Link>
                </div>

                {/* Card 2: Men's Fashion */}
                <div className="bg-white p-5 shadow-xl rounded-xl group overflow-hidden">
                    <h2 className="text-xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">Men's Premium Collection</h2>
                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                        <Image src="/placeholder-product.png" alt="Men's Fashion" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">NEW ARRIVAL</div>
                    </div>
                    <Link href="/category/men" className="text-orange-600 hover:underline text-sm font-bold flex items-center gap-2">
                        Shop Now →
                    </Link>
                </div>

                {/* Card 3: Home Linen */}
                <div className="bg-white p-5 shadow-xl rounded-xl group overflow-hidden">
                    <h2 className="text-xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">Revamp Your Home</h2>
                    <div className="grid grid-cols-1 gap-3 aspect-square mb-4">
                        <div className="relative rounded-lg overflow-hidden bg-gray-50 h-[48%] group/item">
                            <Image src="/placeholder-product.png" alt="Bedsheets" fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-black text-lg shadow-inner">BEDSHEETS</div>
                        </div>
                        <div className="relative rounded-lg overflow-hidden bg-gray-50 h-[48%] group/item">
                            <Image src="/placeholder-product.png" alt="Towels" fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-black text-lg shadow-inner">TOWELS</div>
                        </div>
                    </div>
                    <Link href="/category/home-linen" className="text-orange-600 hover:underline text-sm font-bold flex items-center gap-2">
                        See All Home Essentials →
                    </Link>
                </div>

                {/* Card 4: Kids & Membership */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 shadow-xl rounded-xl border-t-4 border-orange-600">
                        <h2 className="text-lg font-black text-gray-900 mb-2">Exclusive Deals for You</h2>
                        <p className="text-xs text-gray-500 mb-4 font-medium leading-relaxed">Join our membership and get extra 20% off on your first order!</p>
                        <button className="bg-orange-600 w-full py-3 rounded-xl font-black text-white text-sm shadow-[0_10px_20px_-5px_rgba(234,88,12,0.4)] hover:bg-orange-700 active:scale-95 transition-all">
                            Join Now
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600 to-red-600 p-6 shadow-xl rounded-xl flex-1 relative overflow-hidden group">
                        <div className="relative z-10 text-white">
                            <h2 className="text-2xl font-black mb-1">KIDS WEAR</h2>
                            <p className="text-xs font-bold opacity-80 mb-4 tracking-widest uppercase">Up to 60% OFF</p>
                            <Link href="/category/kids" className="bg-white text-orange-600 px-4 py-2 rounded-lg text-xs font-extrabold hover:bg-gray-100 transition-colors inline-block">
                                EXPLORE
                            </Link>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
                    </div>
                </div>

            </div>
        </div>
    );
}
