'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#2dd4bf', '#fb923c', '#818cf8', '#f472b6', '#a78bfa', '#facc15'];

export function RevenueTrendChart({ data }: { data: any[] }) {
    const formattedData = data.map(d => ({
        ...d,
        displayDate: format(new Date(d.date), 'MMM dd')
    }));

    return (
        <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '12px'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2dd4bf"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function TopProductsChart({ data }: { data: any[] }) {
    return (
        <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '11px',
                            fontWeight: 'bold'
                        }}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="#fb923c"
                        radius={[0, 8, 8, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function CategoryPieChart({ data }: { data: any[] }) {
    return (
        <div className="h-[350px] w-full min-h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 px-6">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
