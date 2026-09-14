"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { AppNotification } from "@/lib/services/notifications";

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    organization_id: "org_1",
    type: "lead_received",
    title: "New Lead Received",
    message: "John D. requested a quote for Aluminum Railing via your website form.",
    is_read: false,
    action_url: "/leads",
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "n2",
    organization_id: "org_1",
    type: "ai_recommendation",
    title: "AI Recommendation",
    message: "Campaign 'Spring Fencing' has a high CTR. Consider increasing the daily budget.",
    is_read: false,
    action_url: "/recommendations",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "n3",
    organization_id: "org_1",
    type: "campaign_published",
    title: "Campaign Published",
    message: "Your campaign 'Deck Repair NJ' is now live on Facebook.",
    is_read: true,
    action_url: "/campaigns",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 hover:bg-slate-50 transition-colors ${!n.is_read ? "bg-blue-50/50" : ""}`}>
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-medium ${!n.is_read ? "text-slate-900" : "text-slate-600"}`}>{n.title}</h4>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap ml-3">{timeAgo(n.created_at)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
