import ThulasiWomenGallery from '@/components/shop/ThulasiWomenGallery';

export const metadata = {
    title: 'Thulasi Women Collective | Community Gallery',
    description: 'A celebration of our patrons wearing authentic Thulasi heritage weaves.',
};

export default function CommunityPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="pt-20 pb-12 bg-gray-50">
                <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 text-center space-y-4">
                    <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        The <span className="text-orange-600">Collective</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Thulasi Women Worldwide</p>
                </div>
            </div>

            <ThulasiWomenGallery />

            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-24 border-t border-gray-100">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic leading-none">Share Your <span className="text-orange-600">Style Story</span></h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Every Thulasi piece is a chapter in a heritage story. When you wear our weaves, you become a guardian of artisanal tradition. Share your photos with your reviews to be featured in our global collective.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-8 py-4 bg-black text-white rounded-full font-black uppercase text-[10px] tracking-widest">#ThulasiWomen</div>
                            <div className="px-8 py-4 bg-orange-50 text-orange-600 rounded-full font-black uppercase text-[10px] tracking-widest">@ThulasiTextiles</div>
                        </div>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-[3rem] overflow-hidden relative group">
                        <img
                            src="https://images.unsplash.com/photo-1583394838336-acd977730f8a?auto=format&fit=crop&q=80&w=1000"
                            alt="Artisan Weaving"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-black uppercase tracking-widest text-[10px]">Behind the Weave</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
