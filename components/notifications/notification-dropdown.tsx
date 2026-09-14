"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCircle2, AlertTriangle, Lightbulb, Link2Off, DollarSign, Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNotificationsAction, markAllAsReadAction, markAsReadAction } from "@/app/(dashboard)/notifications/actions";
import { AppNotification, NotificationType } from "@/lib/services/notifications";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const typeIcons: Record<NotificationType | string, React.ReactNode> = {
  lead_received: <Users className="h-4 w-4 text-blue-500" />,
  campaign_published: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  campaign_failed: <XCircle className="h-4 w-4 text-destructive" />,
  budget_warning: <DollarSign className="h-4 w-4 text-amber-500" />,
  high_cpl: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  ai_recommendation: <Lightbulb className="h-4 w-4 text-primary" />,
  subscription_warning: <AlertTriangle className="h-4 w-4 text-destructive" />,
  integration_disconnected: <Link2Off className="h-4 w-4 text-destructive" />,
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsAction();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // In a real app we'd set up Supabase Realtime here.
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    await markAllAsReadAction();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success("All notifications marked as read");
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await markAsReadAction(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-destructive-foreground ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary" onClick={handleMarkAllRead}>
                  <Check className="h-3 w-3 mr-1" /> Mark all read
                </Button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Bell className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notification) => (
                    <Link
                      href={notification.action_url || "/notifications"}
                      key={notification.id}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-start gap-3 border-b p-4 transition-colors hover:bg-muted/50",
                        !notification.is_read ? "bg-primary/5" : "bg-card"
                      )}
                    >
                      <div className="mt-1 shrink-0 bg-background rounded-full p-1 border shadow-sm">
                        {typeIcons[notification.type || ''] || <Bell className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm font-medium leading-none", !notification.is_read && "text-foreground")}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="shrink-0 flex items-center self-center pl-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full hover:bg-primary/20 hover:text-primary text-muted-foreground opacity-50"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            title="Mark as read"
                          >
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          </Button>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t p-2">
              <Button asChild variant="ghost" className="w-full justify-center text-sm" onClick={() => setIsOpen(false)}>
                <Link href="/notifications">View all notifications</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
