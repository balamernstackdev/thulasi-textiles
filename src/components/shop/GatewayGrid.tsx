import QuadCard from './QuadCard';

interface GatewayGridProps {
    children: React.ReactNode;
}

export default function GatewayGrid({ children }: GatewayGridProps) {
    return (
        <section className="relative z-20 -mt-20 lg:-mt-32 max-w-[1700px] mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10">
                {children}
            </div>
        </section>
    );
}
