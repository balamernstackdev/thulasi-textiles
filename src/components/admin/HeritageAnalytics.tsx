'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Award, Users, Info } from 'lucide-react';

const COLORS = ['#ea580c', '#0d9488', '#2563eb', '#7c3aed', '#db2777'];

export default function HeritageAnalytics({ data }: { data: any }) {
    const { artisanDistribution = [], certificationTrends = [] } = data || {};

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Artisan Sales Distribution */}
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-orange-600" />
                        <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Artisan Contribution</h3>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={artisanDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {artisanDistribution.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    {artisanDistribution.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-[10px] font-black uppercase text-gray-500 truncate">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Certification Trend */}
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Certification Velocity</h3>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={certificationTrends}>
                            <defs>
                                <linearGradient id="colorCert" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                textAnchor="end"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#0d9488"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorCert)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
