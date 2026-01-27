import { getDashboardStats } from '@/lib/actions/order';
import { ShoppingBag, DollarSign, Package, Clock, TrendingUp, PieChart, BarChart3, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { RevenueTrendChart, TopProductsChart, CategoryPieChart } from '@/components/admin/DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const result = await getDashboardStats();
  const statsData = (result?.success && result?.data) ? result.data : {
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
    {
      title: "Total Orders",
      value: (statsData?.orderCount || 0).toString(),
      change: "Lifetime cumulative",
      icon: ShoppingBag,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      href: "/admin/orders"
    },
    {
      title: "Total Revenue",
      value: `₹${(statsData?.totalRevenue || 0).toLocaleString()}`,
      change: "From paid orders",
      icon: DollarSign,
      color: "bg-orange-600",
      textColor: "text-orange-600",
      href: "/admin/orders"
    },
    {
      title: "Total Products",
      value: (statsData?.productCount || 0).toString(),
      change: "Active in catalog",
      icon: Package,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      href: "/admin/products"
    },
    {
      title: "New Customers",
      value: (statsData?.analytics?.salesTrend.reduce((sum: number, day: any) => sum + day.customers, 0) || 0).toString(),
      change: "Last 30 days",
      icon: Users,
      color: "bg-indigo-600",
      textColor: "text-indigo-600",
      href: "/admin/customers"
    },
    {
      title: "Pending Actions",
      value: (statsData?.pendingOrdersCount || 0).toString(),
      change: "Waiting for processing",
      icon: Clock,
      color: "bg-rose-600",
      textColor: "text-rose-600",
      href: "/admin/orders?status=PENDING"
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Dashboard Overview</h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Live metrics & store health insights</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Sync Active</span>
        </div>
      </div>

      {/* Primary Stats Grid - Optimized for 5 items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-orange-500 hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-400 font-black text-[9px] uppercase tracking-widest">{stat.title}</p>
              </div>
              <h3 className="text-2xl font-black text-gray-900 truncate">{stat.value}</h3>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                {stat.change}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics Visualization Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Sales Trend (30D)
            </h3>
            <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-widest">Revenue Flow</span>
          </div>
          <RevenueTrendChart data={statsData?.analytics?.salesTrend || []} />
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 text-sm">
              <PieChart className="w-4 h-4 text-orange-500" /> Revenue Split
            </h3>
          </div>
          <CategoryPieChart data={statsData?.analytics?.categoryData || []} />
        </div>
      </div>

      {/* Secondary Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 uppercase tracking-tighter mb-6 flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4 text-blue-500" /> Top Performing Products
          </h3>
          <TopProductsChart data={statsData?.analytics?.topSellingProducts || []} />
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-purple-500" /> Recent Transactions
            </h3>
            <Link href="/admin/orders" className="text-[10px] font-black text-orange-600 uppercase hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {statsData?.recentOrders && statsData.recentOrders.length > 0 ? (
              statsData.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all border border-gray-100/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-xs">#{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.user?.name || 'Guest'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-xs">₹{order.total.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">{format(new Date(order.createdAt), 'MMM dd')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                No active cycles
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Third Row: Inventory & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> Low Stock Alerts
            </h3>
            <Link href="/admin/inventory" className="text-[10px] font-black text-rose-600 uppercase hover:underline">Manage All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsData?.lowStockProducts && statsData.lowStockProducts.length > 0 ? (
              statsData.lowStockProducts.map((product: any) => (
                <div key={product.id} className="p-4 rounded-2xl bg-rose-50/30 border border-rose-100 flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-[11px] leading-tight line-clamp-2">{product.name}</p>
                      <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mt-1">
                        {product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)} units left
                      </p>
                    </div>
                  </div>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <button className="w-full bg-white text-gray-700 border border-gray-200 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                      Restock Now
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full h-24 flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                Optimal Inventory Levels
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col justify-between gap-6">
          <div>
            <h3 className="font-black text-white uppercase tracking-tighter flex items-center gap-2 text-sm mb-6">
              <TrendingUp className="w-4 h-4 text-teal-400" /> Quick Actions
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Store Items</span>
                <span className="text-sm font-black text-white">{statsData?.productCount || 0}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Product Categories</span>
                <span className="text-sm font-black text-white">{statsData?.categoryCount || 0}</span>
              </div>
            </div>
          </div>
          <Link href="/admin/inventory">
            <button className="w-full bg-teal-400 text-[#1e293b] py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl shadow-teal-500/20">
              Launch Inventory Suite
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
