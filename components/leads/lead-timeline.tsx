"use client";

import { MessageSquare, Phone, CheckCircle2, FileText } from "lucide-react";

export function LeadTimeline() {
  const events = [
    { id: 1, type: "note", user: "You", content: "Customer is looking to install next month. Sent brochure.", time: "1 hour ago", icon: FileText, color: "bg-blue-100 text-blue-600" },
    { id: 2, type: "status_change", user: "System", content: "Status changed to Contacted", time: "1 hour ago", icon: CheckCircle2, color: "bg-slate-100 text-slate-600" },
    { id: 3, type: "call", user: "You", content: "Outbound call. Left voicemail.", time: "2 hours ago", icon: Phone, color: "bg-green-100 text-green-600" },
    { id: 4, type: "lead_created", user: "System", content: "Lead submitted via Meta Lead Ads (Fall Promo)", time: "1 day ago", icon: MessageSquare, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Note Input */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <textarea 
          placeholder="Add a note about this lead..." 
          className="w-full resize-none border-0 bg-transparent focus:ring-0 sm:text-sm text-slate-900 placeholder:text-slate-400"
          rows={3}
        />
        <div className="flex justify-end mt-2 pt-2 border-t border-slate-100">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
            Save Note
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {events.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-slate-50 ${event.color}`}>
                      <event.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-900 mr-1">{event.user}</span>
                        {event.content}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-slate-500">
                      <time dateTime={event.time}>{event.time}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
