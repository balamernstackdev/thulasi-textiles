import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-12 w-64 md:h-16 md:w-96 rounded-2xl" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
                ))}
            </div>

            {/* Charts Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-[450px] w-full rounded-[3rem]" />
                <Skeleton className="h-[450px] w-full rounded-[3rem]" />
            </div>

            {/* Table Section Skeleton */}
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[400px] w-full rounded-[3rem]" />
                    <Skeleton className="h-[400px] w-full rounded-[3rem]" />
                </div>
            </div>
        </div>
    );
}
