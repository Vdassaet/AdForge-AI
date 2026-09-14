import { DateFilter } from "@/components/analytics/date-filter";
import { MetricsGrid } from "@/components/analytics/metrics-grid";
import { PerformanceCharts } from "@/components/analytics/performance-charts";
import { ComparisonTables } from "@/components/analytics/comparison-tables";
import { Download } from "lucide-react";

export default function AnalyticsPage() {
  const hasData = true; // In a real app, query `analytics_daily` table

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header & Date Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Measure ad performance, cost per lead, and estimated revenue.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DateFilter />
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors h-[34px]">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No Data Available Yet</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            We don&apos;t have any analytics data to show. Once you publish your first campaign and start receiving traffic, your metrics will appear here.
          </p>
          <a href="/campaigns/new" className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Create Campaign
          </a>
        </div>
      ) : (
        <>
          <MetricsGrid />
          <PerformanceCharts />
          <div className="pt-2">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Detailed Breakdown</h3>
            <ComparisonTables />
          </div>
        </>
      )}
    </div>
  );
}
