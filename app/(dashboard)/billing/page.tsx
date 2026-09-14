import { BillingDashboard } from "@/components/billing/billing-dashboard";

export default function BillingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Billing &amp; Usage</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your subscription, track usage, and upgrade your plan.
        </p>
      </div>
      <BillingDashboard />
    </div>
  );
}
