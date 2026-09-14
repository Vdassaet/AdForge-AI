export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Campaign Details</h1>
          <p className="mt-1 text-sm text-slate-500">
            Viewing campaign ID: {params.id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-md hover:bg-slate-50">
            Edit
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100">
            Pause Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold border-b pb-3 mb-4">Performance Preview</h2>
          <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            Charts will appear here once the campaign gathers data.
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold border-b pb-3 mb-4">Settings</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-medium inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs mt-1">Active</p>
            </div>
            <div>
              <p className="text-slate-500">Objective</p>
              <p className="font-medium">Leads</p>
            </div>
            <div>
              <p className="text-slate-500">Budget</p>
              <p className="font-medium">$20.00 / day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
