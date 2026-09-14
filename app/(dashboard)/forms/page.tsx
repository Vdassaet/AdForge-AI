import { FormList } from "@/components/forms/form-list";

export default function FormsDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Website Forms</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and embed lead capture forms directly onto your website. 
          Leads generated here will automatically sync to your CRM and Analytics.
        </p>
      </div>
      
      <FormList />
    </div>
  );
}
