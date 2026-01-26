'use client';

export function ProductSectionSkeleton() {
    return (
        <section className="py-12 md:py-16 bg-white animate-pulse">
            <div className="max-w-[1700px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="space-y-2">
                        <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
                        <div className="h-4 w-96 bg-gray-100 rounded-lg"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-square bg-gray-200 rounded-xl"></div>
                            <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function BannerSkeleton() {
    return (
        <div className="w-full h-[380px] bg-gray-200 animate-pulse my-4 rounded-3xl mx-auto max-w-[1700px]"></div>
    );
}

export function HomeSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <BannerSkeleton />
            <ProductSectionSkeleton />
            <ProductSectionSkeleton />
        </div>
    );
}
