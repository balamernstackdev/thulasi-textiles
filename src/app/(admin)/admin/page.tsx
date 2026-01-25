
import prismadb from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, DollarSign, Package, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let productCount = 0;
  let categoryCount = 0;

  try {
    productCount = await prismadb.product.count();
    categoryCount = await prismadb.category.count();
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }

  // Placeholder for orders until we have the model fully populated
  const orderCount = 0;
  const revenue = 0;

  const stats = [
    {
      title: "Total Orders",
      value: orderCount.toString(),
      change: "+2.5% from last month",
      icon: ShoppingBag,
      color: "bg-blue-500",
      textColor: "text-blue-500"
    },
    {
      title: "Total Revenue",
      value: `₹${revenue.toLocaleString()}`,
      change: "+15.2% from last month",
      icon: DollarSign,
      color: "bg-orange-500",
      textColor: "text-orange-500"
    },
    {
      title: "Total Products",
      value: productCount.toString(),
      change: "+12.3% from last month",
      icon: Package, // Replaces "Occupied Rooms" from reference
      color: "bg-green-500",
      textColor: "text-green-500"
    },
    {
      title: "Pending Orders",
      value: "0",
      change: "-3.2% from last month",
      icon: Clock, // Replaces "Checkouts"
      color: "bg-red-500",
      textColor: "text-red-500"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to your store management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
              <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg shadow-${stat.textColor}/20`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" /> Recent Activity
          </h3>
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
            No recent activity
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" /> Recent Products
          </h3>
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
            No products added recently
          </div>
        </div>
      </div>
    </div>
  );
}
