"use client";

import { Info } from "lucide-react";

export function MetricsGrid() {
  // Mock data for analytics
  const metrics = [
    { label: "Ad Spend", value: "$1,240.50", change: "+12.5%", trend: "up", isEstimated: false },
    { label: "Impressions", value: "45,231", change: "+5.2%", trend: "up", isEstimated: false },
    { label: "Clicks", value: "1,102", change: "+2.1%", trend: "up", isEstimated: false },
    { label: "CTR", value: "2.44%", change: "-0.5%", trend: "down", isEstimated: false },
    { label: "CPC", value: "$1.12", change: "+0.1%", trend: "down", isEstimated: false },
    { label: "Leads", value: "45", change: "+18.2%", trend: "up", isEstimated: false },
    { label: "Cost Per Lead", value: "$27.56", change: "-4.5%", trend: "up", isEstimated: false },
    { label: "Conversion Rate", value: "4.08%", change: "+1.2%", trend: "up", isEstimated: false },
    { label: "Est. Revenue", value: "$18,500", change: "+24.0%", trend: "up", isEstimated: true },
    { label: "Est. ROAS", value: "14.9x", change: "+10.2%", trend: "up", isEstimated: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative">
          {metric.isEstimated && (
            <div className="absolute top-4 right-4 group">
              <Info className="w-4 h-4 text-slate-400 cursor-help" />
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10">
                Estimated metric based on historical average deal size and close rate.
              </div>
            </div>
          )}
          <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
            {metric.label}
            {metric.isEstimated && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold uppercase tracking-wider">Est</span>}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
          </div>
          <p className={`text-xs font-medium mt-2 ${
            metric.trend === 'up' && metric.change.startsWith('+') ? 'text-green-600' :
            metric.trend === 'up' && metric.change.startsWith('-') ? 'text-green-600' : // e.g. lower CPC is good
            metric.trend === 'down' && metric.change.startsWith('-') ? 'text-red-600' :
            'text-slate-600'
          }`}>
            {metric.change} vs previous period
          </p>
        </div>
      ))}
    </div>
  );
}
