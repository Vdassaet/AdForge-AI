"use client";

import { useState } from "react";
import { Search, Share2, Globe, Phone, Mail } from "lucide-react";
import { demoStore } from "@/lib/demo/demo-data";
import { SimulatedBadge } from "@/components/demo/simulated-badge";
import { toast } from "sonner";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-700";
    case "contacted":
      return "bg-amber-100 text-amber-700";
    case "qualified":
      return "bg-purple-100 text-purple-700";
    case "estimate":
      return "bg-indigo-100 text-indigo-700";
    case "won":
      return "bg-green-100 text-green-700";
    case "lost":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "Meta":
      return <Share2 className="w-4 h-4 text-blue-600" />;
    case "Website":
      return <Globe className="w-4 h-4 text-slate-500" />;
    case "Phone":
      return <Phone className="w-4 h-4 text-green-600" />;
    default:
      return <Mail className="w-4 h-4 text-slate-500" />;
  }
};

export function LeadTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const leads = demoStore.getLeads();

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, phone, or service..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses ({leads.length})</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="estimate">Estimate Sent</option>
            <option value="won">Won Deals</option>
          </select>
          <SimulatedBadge variant="subtle" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Lead Details</th>
              <th className="px-6 py-3.5">Service Requested</th>
              <th className="px-6 py-3.5">Estimated Value</th>
              <th className="px-6 py-3.5">Source</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900">{lead.name}</span>
                    <SimulatedBadge variant="subtle" label="Demo" />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{lead.phone}</span>
                    <span>&bull;</span>
                    <span>{lead.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  {lead.service}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-slate-900">
                  ${lead.estimatedValue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {getSourceIcon(lead.source)}
                    <span className="text-xs font-medium text-slate-700">{lead.source}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{lead.date}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toast.info(`Viewing demo lead ${lead.name} (${lead.service})`)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
