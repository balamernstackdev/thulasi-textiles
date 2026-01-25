import { getDashboardStats } from '@/lib/actions/order';
import { ShoppingBag, DollarSign, Package, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const result = await getDashboardStats();
  const statsData = (result?.success && result?.data) ? result.data : {
    orderCount: 0,
    totalRevenue: 0,
    productCount: 0,
    categoryCount: 0,
    recentOrders: [],
    pendingOrdersCount: 0
  };

  const stats = [
    {
      title: "Total Orders",
      value: (statsData?.orderCount || 0).toString(),
      change: "Lifetime cumulative",
      icon: ShoppingBag,
      color: "bg-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: `₹${(statsData?.totalRevenue || 0).toLocaleString()}`,
      change: "From paid orders",
      icon: DollarSign,
      color: "bg-orange-600",
      textColor: "text-orange-600"
    },
    {
      title: "Total Products",
      value: (statsData?.productCount || 0).toString(),
      change: "Active in catalog",
      icon: Package,
      color: "bg-emerald-600",
      textColor: "text-emerald-600"
    },
    {
      title: "Pending Actions",
      value: (statsData?.pendingOrdersCount || 0).toString(),
      change: "Waiting for processing",
      icon: Clock,
      color: "bg-rose-600",
      textColor: "text-rose-600"
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Store-front health & live metrics</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#2dd4bf] transition-all">
            <div>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-2xl font-black mt-1 text-gray-900">{stat.value}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-2">
                {stat.change}
              </p>
            </div>
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-xl shadow-${stat.textColor}/20 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 uppercase italic tracking-tighter mb-6 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" /> Recent Orders
          </h3>
          <div className="space-y-4">
            {statsData?.recentOrders && statsData.recentOrders.length > 0 ? (
              statsData.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-blue-500 transition-colors">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.user?.name || 'Guest User'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">₹{order.total.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(order.createdAt), 'MMM dd, HH:mm')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest italic bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                No recent orders found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 uppercase italic tracking-tighter mb-6 flex items-center gap-3">
            <Package className="w-5 h-5 text-emerald-500" /> Quick Stats
          </h3>
          <div className="space-y-6">
            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Products</p>
                  <h4 className="text-3xl font-black text-emerald-900">{statsData?.productCount || 0}</h4>
                </div>
                <Package className="w-8 h-8 text-emerald-200" />
              </div>
            </div>
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total Categories</p>
                  <h4 className="text-3xl font-black text-blue-900">{statsData?.categoryCount || 0}</h4>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
