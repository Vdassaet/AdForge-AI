"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Megaphone,
  TrendingUp,
  DollarSign,
  Users,
  PauseCircle,
  BarChart2,
} from "lucide-react";
import { demoStore } from "@/lib/demo/demo-data";
import { SimulatedBadge } from "@/components/demo/simulated-badge";
import { toast } from "sonner";

export default function CampaignsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const campaigns = demoStore.getCampaigns();

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpend = campaigns.reduce((acc, c) => acc + c.totalSpend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadsCount, 0);
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
            <SimulatedBadge variant="outline" label="Demo Data" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Active and scheduled advertising campaigns for NJ Fence and Railing on Meta platforms.
          </p>
        </div>

        <Link
          href="/campaigns/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Link>
      </div>

      {/* Aggregate Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
            <span>Total Demo Spend</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400">Across 3 active campaigns</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
            <span>Total Leads Generated</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
          <span className="text-[11px] text-emerald-600 font-medium">86 inquiries &bull; 11.4% conv</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
            <span>Avg Cost Per Lead</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600">${avgCpl.toFixed(2)}</p>
          <span className="text-[11px] text-slate-400">Target benchmark: &lt; $35.00</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Search & Filter bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search campaigns by service, location..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => toast.info("Filter applied: All Active")}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" /> All Statuses
            </button>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Campaign Name</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Daily Budget</th>
                <th className="px-6 py-3.5">Spend</th>
                <th className="px-6 py-3.5">Leads / Calls</th>
                <th className="px-6 py-3.5">Cost / Lead</th>
                <th className="px-6 py-3.5">CTR</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-900 text-sm">{camp.name}</p>
                          <SimulatedBadge variant="subtle" />
                        </div>
                        <p className="text-slate-500 text-[11px]">{camp.location}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {camp.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-mono font-medium text-slate-900">
                    ${camp.dailyBudget}/day
                  </td>

                  <td className="px-6 py-4 font-mono text-slate-600">
                    ${camp.totalSpend.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{camp.leadsCount} leads</span>
                    <span className="text-slate-400 block text-[11px]">({camp.callsCount} calls)</span>
                  </td>

                  <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                    ${camp.cpl.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 font-mono text-slate-700 font-medium">
                    {camp.ctr}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/analytics"
                        title="View Campaign Analytics"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => toast.info(`Simulated: Campaign "${camp.name}" paused in demo.`)}
                        title="Pause campaign (simulated)"
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                      >
                        <PauseCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
