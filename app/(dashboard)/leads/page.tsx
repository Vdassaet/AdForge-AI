import { LeadMetrics } from "@/components/leads/lead-metrics";
import { LeadTable } from "@/components/leads/lead-table";
import { Download } from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Lead Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage incoming leads from your ad campaigns and website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <LeadMetrics />
      
      <LeadTable />
    </div>
  );
}
