import { CallsDashboard } from "@/components/calls/calls-dashboard";

export default function CallsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Call Tracking</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor incoming phone calls driven by your ad campaigns.
        </p>
      </div>
      
      <CallsDashboard />
    </div>
  );
}
