import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-12 w-64 md:h-16 md:w-80 rounded-2xl" />
                    <Skeleton className="h-4 w-40 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-48 rounded-2xl" />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap gap-4">
                <Skeleton className="h-12 w-full md:w-96 rounded-2xl" />
                <Skeleton className="h-12 w-32 rounded-2xl" />
                <Skeleton className="h-12 w-32 rounded-2xl" />
            </div>

            {/* Table Shell */}
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-4 flex-1 rounded-full" />
                    ))}
                </div>
                <div className="p-8 space-y-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <Skeleton className="h-4 flex-1 rounded-full" />
                            <Skeleton className="h-4 w-24 rounded-full" />
                            <Skeleton className="h-4 w-24 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
