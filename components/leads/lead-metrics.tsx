"use client";

import { Users, UserPlus, FileText, CheckCircle2 } from "lucide-react";

export function LeadMetrics() {
  const metrics = [
    { title: "Total Leads", value: "245", trend: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "New Leads", value: "18", trend: "+4%", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Estimates Sent", value: "45", trend: "+2%", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Jobs Won", value: "32", trend: "+8%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric) => (
        <div key={metric.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className={`p-3 rounded-lg ${metric.bg} ${metric.color}`}>
            <metric.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{metric.title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-semibold text-slate-900">{metric.value}</h3>
              <span className="text-xs font-medium text-green-600">{metric.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
