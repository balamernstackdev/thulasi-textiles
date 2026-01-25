import Link from 'next/link';
import Image from 'next/image';

interface QuadItem {
    title: string;
    imageUrl: string;
    link: string;
}

interface QuadCardProps {
    title: string;
    items: QuadItem[];
    footerLink: {
        text: string;
        href: string;
    };
}

export default function QuadCard({ title, items, footerLink }: QuadCardProps) {
    return (
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col h-full transition-all duration-300 hover:shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{title}</h2>

            <div className="grid grid-cols-2 gap-3 flex-1">
                {items.slice(0, 4).map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.link}
                        className="group/item flex flex-col gap-1"
                    >
                        <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100 transition-all duration-300 group-hover/item:opacity-80">
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 leading-tight transition-colors group-hover/item:text-blue-600">
                            {item.title}
                        </span>
                    </Link>
                ))}
            </div>

            <Link
                href={footerLink.href}
                className="mt-4 text-xs font-medium text-blue-600 hover:text-orange-600 transition-colors inline-flex items-center gap-1"
            >
                {footerLink.text}
            </Link>
        </div>
    );
}
