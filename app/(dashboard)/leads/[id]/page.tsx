"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, User, Calendar, Tag, Share2 } from "lucide-react";
import { LeadTimeline } from "@/components/leads/lead-timeline";
import { LeadActions } from "@/components/leads/lead-actions";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  // Dummy lead data for UI structure
  const lead = {
    id: params.id,
    name: "Sarah Jenkins",
    phone: "(555) 123-4567",
    email: "sarah.j@example.com",
    service: "Aluminum Fencing",
    location: "Rockland County, NY",
    source: "Meta",
    campaign: "Fall 2026 Promo - Aluminum",
    status: "new",
    message: "I have a backyard that needs about 150ft of aluminum fencing installed before winter. Please call me for an estimate.",
    date: "Oct 15, 2026",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/leads"
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Lead Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg">
                {lead.name.split(" ").map(n => n[0]).join("")}
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                {lead.status}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1">{lead.name}</h2>
            
            <div className="mt-6">
              <LeadActions phone={lead.phone} email={lead.email} />
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Location</p>
                  <p className="text-sm text-slate-900 font-medium">{lead.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Service Requested</p>
                  <p className="text-sm text-slate-900 font-medium">{lead.service}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Share2 className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Source</p>
                  <p className="text-sm text-slate-900 font-medium">{lead.source}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Campaign: {lead.campaign}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Received</p>
                  <p className="text-sm text-slate-900 font-medium">{lead.date}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Message
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 italic border border-slate-100">
              &quot;{lead.message}&quot;
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Activity Timeline</h2>
            <LeadTimeline />
          </div>
        </div>

      </div>
    </div>
  );
}
