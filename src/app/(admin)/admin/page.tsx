import { Suspense } from 'react';
import { getDashboardStats, getAdvancedAnalytics } from '@/lib/actions/order';
import { getSalesAnalyticsData, getAdminDashboardStats, getInventoryHeatmapData, getHeritageAnalyticsData } from '@/lib/actions/admin-analytics';
import SalesAnalytics from '@/components/admin/SalesAnalytics';
import HeritageAnalytics from '@/components/admin/HeritageAnalytics';
import { InventoryHeatmap } from '@/components/admin/AnalyticsCharts';
import SearchTrendsChart from '@/components/admin/SearchTrendsChart';
import {
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  PieChart,
  Users,
  AlertTriangle,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { RevenueTrendChart, TopProductsChart, CategoryPieChart } from '@/components/admin/DashboardCharts';
import { SalesHeatmap, InventoryVelocityChart, VIPLeaderboard } from '@/components/admin/AnalyticsCharts';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

async function StatsGrid() {
  const statsResult = await getDashboardStats();
  const statsData = (statsResult?.success && statsResult?.data) ? statsResult.data : {
    orderCount: 0,
    totalRevenue: 0,
    productCount: 0,
    categoryCount: 0,
    recentOrders: [],
    pendingOrdersCount: 0,
    lowStockProducts: [],
    analytics: {
      salesTrend: [],
      categoryData: [],
      topSellingProducts: []
    }
  };

  const stats = [
    { title: "Total Orders", value: (statsData?.orderCount || 0).toString(), change: "Lifetime cumulative", icon: ShoppingBag, color: "bg-blue-600", href: "/admin/orders" },
    { title: "Total Revenue", value: `₹${(statsData?.totalRevenue || 0).toLocaleString()}`, change: "From paid orders", icon: DollarSign, color: "bg-orange-600", href: "/admin/orders" },
    { title: "Total Products", value: (statsData?.productCount || 0).toString(), change: "Active in catalog", icon: Package, color: "bg-emerald-600", href: "/admin/products" },
    { title: "New Customers", value: (statsData?.analytics?.salesTrend.reduce((sum: number, day: any) => sum + day.customers, 0) || 0).toString(), change: "Last 30 days", icon: Users, color: "bg-indigo-600", href: "/admin/customers" },
    { title: "Pending Actions", value: (statsData?.pendingOrdersCount || 0).toString(), change: "Waiting for fulfillment", icon: Clock, color: "bg-rose-600", href: "/admin/inventory/fulfillment" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <Link
          key={index}
          href={stat.href}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:border-black hover:shadow-2xl transition-all active:scale-95 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest leading-none text-wrap line-clamp-1">{stat.title}</p>
            </div>
            <h3 className="text-3xl font-black text-gray-900 truncate tracking-tight italic">
              {stat.value}
            </h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-2">
              {stat.change}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function IntelligenceHub() {
  const advancedResult = await getAdvancedAnalytics();
  const advancedData = (advancedResult?.success && advancedResult?.data) ? advancedResult.data : {
    heatmap: [],
    velocity: [],
    vips: []
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <Target className="w-5 h-5 text-orange-500" />
          <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Purchase Behavior Heatmap</h3>
        </div>
        <SalesHeatmap data={advancedData.heatmap} />
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Patron VIPs (CLV)</h3>
        </div>
        <VIPLeaderboard vips={advancedData.vips} />
      </div>

      <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Inventory Velocity</h3>
        </div>
        <InventoryVelocityChart data={advancedData.velocity} />
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-5 h-5 text-orange-500" />
            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Category Search Trends</h3>
          </div>
          <SearchTrendsChart />
        </div>
        <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <p className="text-[10px] font-bold text-orange-700 leading-relaxed italic">
            "Kanchipuram Silk" remains the most coveted weave this season.
          </p>
        </div>
      </div>
    </div>
  );
}

async function SalesTrendRow() {
  const [stats, salesData] = await Promise.all([
    getAdminDashboardStats(),
    getSalesAnalyticsData('30d')
  ]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Real-time Performance</h3>
        </div>
        <SalesAnalytics data={salesData} summary={stats} />
      </div>
    </div>
  );
}

async function InventoryAndLedger() {
  const [stats, inventoryData] = await Promise.all([
    getAdminDashboardStats(),
    getInventoryHeatmapData()
  ]);

  const statsData = stats || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Stock Health
          </h3>
          <Link href="/admin/inventory" className="text-[10px] font-black text-rose-600 uppercase hover:underline tracking-widest">Manage All</Link>
        </div>

        {/* Inventory Heatmap */}
        <div className="mb-8">
          <InventoryHeatmap data={inventoryData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statsData?.lowStockProducts && statsData.lowStockProducts.length > 0 ? (
            statsData.lowStockProducts.map((product: any) => (
              <div key={product.id} className="p-5 rounded-3xl bg-rose-50/30 border border-rose-100 flex flex-col justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-xs leading-tight line-clamp-2">{product.name}</p>
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1">
                      {product.stock} units left
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-24 flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic bg-gray-50/20 rounded-3xl border-2 border-dashed border-gray-100">
              Inventory Balanced
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-purple-500" /> Recent Ledger
          </h3>
          <Link href="/admin/orders" className="text-[10px] font-black text-orange-600 uppercase hover:underline tracking-widest">View All</Link>
        </div>
        <div className="space-y-4">
          {statsData?.recentOrders?.map((order: any) => (
            <div key={order.id} className="flex items-center justify-between p-5 rounded-3xl hover:bg-gray-50 transition-all border border-gray-100/50 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 shadow-inner">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm tracking-tight italic">#{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">{order.user?.name || 'Guest'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900 text-sm italic">₹{order.total.toLocaleString()}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{format(new Date(order.createdAt), 'MMM dd')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function HeritageInsightsRow() {
  const heritageData = await getHeritageAnalyticsData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg">
          <Trophy className="w-5 h-5 fill-white" />
        </div>
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Heritage & Artisan Insights</h2>
      </div>
      <HeritageAnalytics data={heritageData} />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-8 space-y-12 w-full pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter italic">Command Center</h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.3em] font-black">Strategic business intelligence & heritage operations</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-black px-6 py-3 rounded-2xl shadow-xl shadow-black/10">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Market Intel Live</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 rounded-[2.5rem]" />)}
      </div>}>
        <StatsGrid />
      </Suspense>

      {/* Heritage Insights Row */}
      <Suspense fallback={<Skeleton className="h-[400px] rounded-[3rem]" />}>
        <HeritageInsightsRow />
      </Suspense>

      {/* Advanced Intelligence Hub */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Advanced Intelligence Hub</h2>
        </div>

        <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-[3rem]" />
          <Skeleton className="h-[400px] rounded-[3rem]" />
          <Skeleton className="lg:col-span-2 h-[400px] rounded-[3rem]" />
          <Skeleton className="h-[400px] rounded-[3rem]" />
        </div>}>
          <IntelligenceHub />
        </Suspense>
      </div>

      {/* Sales Trend Row */}
      <Suspense fallback={<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Skeleton className="xl:col-span-2 h-[450px] rounded-[3rem]" />
        <Skeleton className="h-[450px] rounded-[3rem]" />
      </div>}>
        <SalesTrendRow />
      </Suspense>

      {/* Inventory & Transactions */}
      <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] rounded-[3rem]" />
        <Skeleton className="h-[400px] rounded-[3rem]" />
      </div>}>
        <InventoryAndLedger />
      </Suspense>
    </div>
  );
}

