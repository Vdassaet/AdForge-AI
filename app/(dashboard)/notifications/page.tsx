"use client";

import { useEffect, useState } from "react";
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Link2Off, 
  DollarSign, 
  Users, 
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNotificationsAction, markAllAsReadAction, markAsReadAction } from "./actions";
import { AppNotification, NotificationType } from "@/lib/services/notifications";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const typeIcons: Record<NotificationType | string, React.ReactNode> = {
  lead_received: <Users className="h-5 w-5 text-blue-500" />,
  campaign_published: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  campaign_failed: <XCircle className="h-5 w-5 text-destructive" />,
  budget_warning: <DollarSign className="h-5 w-5 text-amber-500" />,
  high_cpl: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  ai_recommendation: <Lightbulb className="h-5 w-5 text-primary" />,
  subscription_warning: <AlertTriangle className="h-5 w-5 text-destructive" />,
  integration_disconnected: <Link2Off className="h-5 w-5 text-destructive" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsAction();
      setNotifications(data);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadAction();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await markAsReadAction(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const renderNotificationList = (list: AppNotification[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed mt-4 bg-muted/10">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            When you receive notifications for leads, campaigns, or system alerts, they will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-4">
        {list.map((notification) => (
          <Card key={notification.id} className={cn("overflow-hidden transition-all", !notification.is_read ? "border-primary/50 shadow-md bg-primary/5" : "")}>
            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
              <div className="shrink-0 pt-1">
                <div className="bg-background rounded-full p-2 border shadow-sm h-10 w-10 flex items-center justify-center">
                  {typeIcons[notification.type || ''] || <Bell className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className={cn("text-base font-medium", !notification.is_read && "text-foreground")}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-2">
                    {new Date(notification.created_at).toLocaleString()}
                    {!notification.is_read && <span className="h-2 w-2 rounded-full bg-primary inline-block" />}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                  {notification.action_url && (
                    <Button asChild size="sm" variant={notification.is_read ? "secondary" : "default"}>
                      <Link href={notification.action_url}>View Details</Link>
                    </Button>
                  )}
                  {!notification.is_read && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                    >
                      <Check className="h-4 w-4 mr-2" /> Mark as read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Manage your alerts, updates, and system messages.</p>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} variant="outline" className="shrink-0 bg-background">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted/50 w-full" />
          ))}
        </div>
      ) : (
        <div className="w-full">
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-2 font-medium text-sm",
                activeTab === "all" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Notifications
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={cn(
                "px-4 py-2 font-medium text-sm flex items-center gap-2",
                activeTab === "unread" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unread
              {unreadCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          
          <div className="focus-visible:outline-none focus-visible:ring-0">
            {activeTab === "all" ? renderNotificationList(notifications) : renderNotificationList(notifications.filter(n => !n.is_read))}
          </div>
        </div>
      )}
    </div>
  );
}
