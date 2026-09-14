import { DataTable } from "@/components/ui/data-table";

export default function ServiceAreasPage() {
  const dummyAreas = [
    { city: "Newark", state: "NJ", zipCode: "07101", radiusMiles: 15, isActive: true },
    { city: "Jersey City", state: "NJ", zipCode: "07097", radiusMiles: 10, isActive: true },
  ];

  const columns = [
    { header: "City", accessorKey: "city" },
    { header: "State", accessorKey: "state" },
    { header: "Zip Code", accessorKey: "zipCode" },
    { header: "Radius (Miles)", accessorKey: "radiusMiles" },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (item: { isActive: boolean }) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "",
      accessorKey: "actions",
      cell: () => <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Edit</button>,
    },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Service Areas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define the geographical areas where you operate.
          </p>
        </div>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Add Area
        </button>
      </div>

      <DataTable columns={columns} data={dummyAreas} emptyMessage="No service areas found." />
    </div>
  );
}
