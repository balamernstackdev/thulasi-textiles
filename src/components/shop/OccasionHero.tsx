import Image from 'next/image';

interface OccasionHeroProps {
    title: string;
    description: string;
    image: string;
}

export default function OccasionHero({ title, description, image }: OccasionHeroProps) {
    return (
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-end">
            {/* Background Image */}
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 md:px-8 pb-16 md:pb-24">
                <div className="max-w-2xl space-y-4 animate-in slide-in-from-bottom duration-700 fade-in">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        By Thulasi Textiles
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1]">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-lg">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
