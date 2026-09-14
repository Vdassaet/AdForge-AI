export default function OrganizationSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Organization Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your company details and business profile.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-slate-900 mb-4">General Information</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Company Name</label>
              <input
                type="text"
                defaultValue="NJ Fence and Railing"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="text"
                defaultValue="(555) 123-4567"
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Website</label>
            <input
              type="url"
              defaultValue="https://njfence.com"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
