/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Legend } from "recharts";

const DUMMY_DATA = [
  { date: "Oct 1", spend: 45, leads: 2, cpl: 22.5 },
  { date: "Oct 2", spend: 50, leads: 3, cpl: 16.6 },
  { date: "Oct 3", spend: 45, leads: 1, cpl: 45 },
  { date: "Oct 4", spend: 60, leads: 4, cpl: 15 },
  { date: "Oct 5", spend: 55, leads: 3, cpl: 18.3 },
  { date: "Oct 6", spend: 75, leads: 5, cpl: 15 },
  { date: "Oct 7", spend: 65, leads: 4, cpl: 16.2 },
];

export function PerformanceCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-80 bg-slate-50 animate-pulse rounded-xl"></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Spend & Leads Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-900">Spend vs Leads</h3>
          <p className="text-sm text-slate-500">Daily advertising spend compared to leads generated.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DUMMY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
              <Area yAxisId="left" type="monotone" dataKey="spend" name="Spend ($)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
              <Area yAxisId="right" type="monotone" dataKey="leads" name="Leads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Per Lead (Bar Chart) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-900">Cost Per Lead (CPL)</h3>
          <p className="text-sm text-slate-500">Daily average cost to acquire one lead.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DUMMY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'CPL']}
              />
              <Bar dataKey="cpl" name="CPL" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
