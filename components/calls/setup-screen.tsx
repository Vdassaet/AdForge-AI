"use client";

import { Phone, ArrowRight, ShieldCheck, BarChart4 } from "lucide-react";

export function CallsSetupScreen() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 max-w-3xl mx-auto mt-12 text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Phone className="w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        Track Calls & Measure Real ROI
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mb-8">
        Connect a telephony provider like Twilio to automatically provision tracking numbers. 
        See exactly which campaigns, ads, and services are driving phone calls to your business.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10 text-left">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <BarChart4 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900">Campaign Attribution</h4>
            <p className="text-sm text-slate-500 mt-1">Know which ad generated the call by using dynamic number insertion (DNI).</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900">Spam Blocking</h4>
            <p className="text-sm text-slate-500 mt-1">Automatically filter out robocalls and spam before they reach your main line.</p>
          </div>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors">
        Connect Provider <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
