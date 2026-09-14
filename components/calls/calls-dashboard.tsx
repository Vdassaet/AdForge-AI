"use client";

import { callService } from "@/lib/services/calls";
import { CallsSetupScreen } from "./setup-screen";
import { PhoneIncoming, PhoneMissed, Clock, Phone } from "lucide-react";

export function CallsDashboard() {
  // In a real app, organization_id would come from context/auth
  const isConfigured = callService.isConfigured();

  if (!isConfigured) {
    return <CallsSetupScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Phone className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-sm">Total Calls</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">142</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <PhoneIncoming className="w-5 h-5 text-green-500" />
            <h3 className="font-medium text-sm">Answered</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">128</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <PhoneMissed className="w-5 h-5 text-red-500" />
            <h3 className="font-medium text-sm">Missed</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">14</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-sm">Avg Duration</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">3m 12s</p>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Calls by Campaign</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Spring Fencing Promo</span>
              <span className="text-sm font-bold text-slate-900">85</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Deck Repair Retargeting</span>
              <span className="text-sm font-bold text-slate-900">34</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Brand Awareness</span>
              <span className="text-sm font-bold text-slate-900">23</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Calls by Service</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Aluminum Fencing</span>
              <span className="text-sm font-bold text-slate-900">62</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Wood Fencing</span>
              <span className="text-sm font-bold text-slate-900">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Decking</span>
              <span className="text-sm font-bold text-slate-900">35</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
