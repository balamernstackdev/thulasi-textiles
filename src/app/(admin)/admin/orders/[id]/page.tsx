import { getAdminOrderById } from '@/lib/actions/order';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import OrderStatusSelector from '@/components/admin/OrderStatusSelector';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const result = await getAdminOrderById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const order = result.data;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header with Back Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                                Order #{order.id.slice(-6).toUpperCase()}
                            </h1>
                            <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h2 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-blue-500" /> Order Items ({order.items.length})
                        </h2>
                        <div className="space-y-6">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4 items-start border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative">
                                        {item.variant.product.images?.[0] ? (
                                            <img
                                                src={item.variant.product.images[0].url}
                                                alt={item.variant.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[8px] font-black uppercase">
                                                No Img
                                            </div>
                                        )}
                                        <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                                            x{item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{item.variant.product.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                            SKU: {item.variant.sku}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            {item.variant.size && (
                                                <span className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider">{item.variant.size}</span>
                                            )}
                                            {item.variant.color && (
                                                <span className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider">{item.variant.color}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900 italic">₹{item.price.toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                            Total: ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Grand Total</span>
                            <span className="text-3xl font-black text-gray-900 italic tracking-tighter">₹{order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Details */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-emerald-500" /> Customer
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-black">
                                {order.user?.name?.charAt(0) || 'G'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{order.user?.name || 'Guest Checkout'}</p>
                                <p className="text-xs text-gray-500 font-medium">{order.user?.email || 'No email provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-rose-500" /> Shipping To
                        </h3>
                        <div className="text-sm text-gray-600 font-medium space-y-1 leading-relaxed">
                            <p className="font-bold text-gray-900">{order.address.name}</p>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">{order.address.country}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-500" /> Payment
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
                                }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium mt-4">
                            Payment ID: <span className="font-mono text-gray-600">{order.paymentId || 'N/A'}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
