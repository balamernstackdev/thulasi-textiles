'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { Star, TrendingUp, Users, Package, Clock } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function SalesHeatmap({ data }: { data: any[] }) {
    if (!data) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Sales Intensity</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Heatmap of orders by Day & Hour</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-gray-400 uppercase">Low</span>
                    <div className="flex gap-0.5">
                        <div className="w-3 h-3 bg-teal-50 rounded-sm" />
                        <div className="w-3 h-3 bg-teal-200 rounded-sm" />
                        <div className="w-3 h-3 bg-teal-400 rounded-sm" />
                        <div className="w-3 h-3 bg-teal-600 rounded-sm" />
                    </div>
                    <span className="text-[8px] font-black text-gray-400 uppercase">High</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar-thin">
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1">
                        <div />
                        {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="text-[8px] font-black text-gray-300 text-center uppercase">{i}h</div>
                        ))}

                        {data.map((dayData, dIdx) => (
                            <div key={dIdx} className="contents">
                                <div className="text-[9px] font-black text-gray-400 uppercase flex items-center">{DAYS[dayData.day]}</div>
                                {dayData.hours.map((hourData: any, hIdx: number) => {
                                    const intensity = hourData.count === 0 ? 'bg-gray-50' :
                                        hourData.count < 3 ? 'bg-teal-100' :
                                            hourData.count < 7 ? 'bg-teal-300' : 'bg-teal-500';
                                    return (
                                        <div
                                            key={hIdx}
                                            className={`aspect-square rounded-sm ${intensity} transition-all hover:ring-2 hover:ring-black cursor-crosshair relative group`}
                                        >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                                {hourData.count} Orders | ₹{hourData.revenue.toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function InventoryVelocityChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }}
                        width={100}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 900 }}
                        cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="velocity" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.velocity > 0.05 ? '#10b981' : '#f59e0b'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function VIPLeaderboard({ vips }: { vips: any[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Patron Royalty</h4>
                <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">Top 10 CLV</span>
            </div>

            <div className="space-y-2">
                {vips.map((vip, idx) => (
                    <div key={vip.id} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-50 hover:border-teal-100 transition-all group shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                                {idx + 1}
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-gray-900 truncate max-w-[120px]">{vip.name}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{vip.orderCount} Orders</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-black text-gray-900 italic">₹{vip.totalSpent.toLocaleString()}</p>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                                <Star className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                                <p className="text-[9px] font-black text-orange-600 italic">{vip.points} pts</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function InventoryHeatmap({ data }: { data: any[] }) {
    // treemap data structure: category > products > stock
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Stock Distribution</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Inventory Health by Category</p>
                </div>
            </div>

            <div className="h-[300px] w-full bg-gray-50 rounded-2xl border border-gray-100 p-1 overflow-hidden relative">
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs font-black uppercase tracking-widest">
                        No Inventory Data
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="horizontal" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }} />
                            <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.stock < 10 ? '#ef4444' : entry.stock < 30 ? '#f59e0b' : '#10b981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
