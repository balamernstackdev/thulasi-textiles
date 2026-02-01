'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'Kanchipuram Silk', searches: 4500, trend: '+12%', color: '#ea580c' },
    { name: 'Organic Linen', searches: 3200, trend: '+25%', color: '#10b981' },
    { name: 'Banarasi Weave', searches: 2800, trend: '-5%', color: '#6366f1' },
    { name: 'Temple Jewelry', searches: 2100, trend: '+40%', color: '#f59e0b' },
    { name: 'Kids Ethnic', searches: 1500, trend: '+8%', color: '#ec4899' },
    { name: 'Home Heritage', searches: 1200, trend: '+15%', color: '#14b8a6' },
];

export default function SearchTrendsChart() {
    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 900 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-black text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{payload[0].payload.name}</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-xl font-black italic">{payload[0].value.toLocaleString()}</p>
                                            <p className="text-[10px] font-bold text-emerald-400">{payload[0].payload.trend} Interest</p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar
                        dataKey="searches"
                        radius={[0, 10, 10, 0]}
                        barSize={32}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
