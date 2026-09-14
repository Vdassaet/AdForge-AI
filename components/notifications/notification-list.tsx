"use client";

import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { AppNotification } from "@/lib/services/notifications";

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", organization_id: "org_1", type: "lead_received", title: "New Lead Received", message: "John D. requested a quote for Aluminum Railing via your website form.", is_read: false, action_url: "/leads", created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: "n2", organization_id: "org_1", type: "ai_recommendation", title: "AI Recommendation Available", message: "Campaign 'Spring Fencing' has a high CTR. Consider increasing the daily budget by 15%.", is_read: false, action_url: "/recommendations", created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "n3", organization_id: "org_1", type: "campaign_published", title: "Campaign Published", message: "Your campaign 'Deck Repair NJ' is now live on Facebook and Instagram.", is_read: true, action_url: "/campaigns", created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: "n4", organization_id: "org_1", type: "budget_warning", title: "Budget Warning", message: "Campaign 'Vinyl Railing' has spent 85% of its daily budget before noon.", is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "n5", organization_id: "org_1", type: "high_cpl", title: "High Cost Per Lead", message: "Campaign 'Metal Fabrication' cost per lead is $45.20, which is 2x your average.", is_read: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

const TYPE_ICONS: Record<string, string> = {
  lead_received: "🟢",
  campaign_published: "🚀",
  campaign_failed: "🔴",
  budget_warning: "⚠️",
  high_cpl: "💰",
  ai_recommendation: "🤖",
  subscription_warning: "💳",
  integration_disconnected: "🔌",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function NotificationList() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-medium text-slate-500">
            {unreadCount} unread
          </span>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
              <Check className="w-4 h-4" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
        {notifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 p-5 transition-colors hover:bg-slate-50 ${!n.is_read ? "bg-blue-50/40" : ""}`}>
            <span className="text-xl mt-0.5 flex-shrink-0">{TYPE_ICONS[n.type || ''] || "📌"}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className={`text-sm font-semibold ${!n.is_read ? "text-slate-900" : "text-slate-600"}`}>{n.title}</h4>
                <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(n.created_at)}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{n.message}</p>
            </div>
            <button className="p-1.5 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
