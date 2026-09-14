"use client";

import { useState } from "react";

export function ComparisonTables() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "services" | "locations">("campaigns");

  const campaignData = [
    { name: "Fall 2026 Promo - Aluminum", spend: 450.0, leads: 12, cpl: 37.5, roas: "12.5x", status: "Active" },
    { name: "Vinyl Fencing Retargeting", spend: 125.5, leads: 8, cpl: 15.68, roas: "18.2x", status: "Active" },
    { name: "Summer Wood Repair", spend: 850.0, leads: 22, cpl: 38.63, roas: "8.4x", status: "Paused" },
  ];

  const serviceData = [
    { name: "Aluminum Fencing", leads: 15, won: 4, conversionRate: "26.6%", estRevenue: 12000 },
    { name: "Vinyl Railing", leads: 12, won: 5, conversionRate: "41.6%", estRevenue: 8500 },
    { name: "Wood Repair", leads: 18, won: 2, conversionRate: "11.1%", estRevenue: 1200 },
  ];

  const locationData = [
    { name: "Rockland County, NY", leads: 25, cpl: 28.5, estRevenue: 15000 },
    { name: "Bergen County, NJ", leads: 14, cpl: 42.1, estRevenue: 4500 },
    { name: "Orange County, NY", leads: 6, cpl: 35.0, estRevenue: 2200 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 flex items-center gap-6 px-6 pt-4 bg-slate-50">
        <button 
          onClick={() => setActiveTab("campaigns")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "campaigns" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Campaigns
        </button>
        <button 
          onClick={() => setActiveTab("services")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "services" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Services
        </button>
        <button 
          onClick={() => setActiveTab("locations")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "locations" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Locations
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-white border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Name</th>
              
              {activeTab === "campaigns" && (
                <>
                  <th className="px-6 py-3 text-right">Spend</th>
                  <th className="px-6 py-3 text-right">Leads</th>
                  <th className="px-6 py-3 text-right">CPL</th>
                  <th className="px-6 py-3 text-right">ROAS</th>
                </>
              )}

              {activeTab === "services" && (
                <>
                  <th className="px-6 py-3 text-right">Leads</th>
                  <th className="px-6 py-3 text-right">Jobs Won</th>
                  <th className="px-6 py-3 text-right">Conv. Rate</th>
                  <th className="px-6 py-3 text-right">Est. Revenue</th>
                </>
              )}

              {activeTab === "locations" && (
                <>
                  <th className="px-6 py-3 text-right">Leads</th>
                  <th className="px-6 py-3 text-right">CPL</th>
                  <th className="px-6 py-3 text-right">Est. Revenue</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeTab === "campaigns" && campaignData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${row.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                  {row.name}
                </td>
                <td className="px-6 py-4 text-right">${row.spend.toFixed(2)}</td>
                <td className="px-6 py-4 text-right font-medium">{row.leads}</td>
                <td className="px-6 py-4 text-right">${row.cpl.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-green-600 font-medium">{row.roas}</td>
              </tr>
            ))}

            {activeTab === "services" && serviceData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                <td className="px-6 py-4 text-right font-medium">{row.leads}</td>
                <td className="px-6 py-4 text-right text-green-600">{row.won}</td>
                <td className="px-6 py-4 text-right">{row.conversionRate}</td>
                <td className="px-6 py-4 text-right font-medium">${row.estRevenue.toLocaleString()}</td>
              </tr>
            ))}

            {activeTab === "locations" && locationData.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                <td className="px-6 py-4 text-right font-medium">{row.leads}</td>
                <td className="px-6 py-4 text-right">${row.cpl.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-green-600 font-medium">${row.estRevenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
