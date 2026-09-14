import { createClient } from "@/lib/supabase/server";

export type NotificationType =
  | 'lead_received'
  | 'campaign_published'
  | 'campaign_failed'
  | 'budget_warning'
  | 'high_cpl'
  | 'ai_recommendation'
  | 'subscription_warning'
  | 'integration_disconnected';

export interface NotificationPayload {
  organization_id: string;
  profile_id?: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
}

export interface AppNotification {
  id: string;
  organization_id: string;
  profile_id?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: string;
  action_url?: string;
}

export interface NotificationChannel {
  name: string;
  send(payload: NotificationPayload): Promise<void>;
}

// Channels Architecture
export class EmailChannel implements NotificationChannel {
  name = "Email";
  async send(payload: NotificationPayload) {
    // DO NOT SEND REAL EMAIL YET
    console.log(`[Email] Preparing to send email to org ${payload.organization_id} - ${payload.title}`);
  }
}

export class SMSChannel implements NotificationChannel {
  name = "SMS";
  async send(payload: NotificationPayload) {
    // DO NOT SEND REAL SMS YET
    console.log(`[SMS] Preparing to send SMS to org ${payload.organization_id} - ${payload.title}`);
  }
}

export class BrowserPushChannel implements NotificationChannel {
  name = "BrowserPush";
  async send(payload: NotificationPayload) {
    // DO NOT SEND REAL PUSH YET
    console.log(`[Browser Push] Preparing to send push to org ${payload.organization_id} - ${payload.title}`);
  }
}

class NotificationService {
  private channels: NotificationChannel[] = [
    new EmailChannel(),
    new SMSChannel(),
    new BrowserPushChannel()
  ];

  async notify(payload: NotificationPayload): Promise<void> {
    console.log(`[Notification] ${payload.type}: ${payload.title}`);
    const supabase = createClient();
    
    // Insert into DB
    // We store type and action_url inside the message field as JSON to avoid modifying the schema, 
    // or if the schema doesn't have it. Actually we can just store the message.
    const messagePayload = JSON.stringify({
      text: payload.message,
      type: payload.type,
      action_url: payload.action_url
    });

    await supabase.from("notifications").insert({
      organization_id: payload.organization_id,
      profile_id: payload.profile_id || null, // Optional, can be org-wide
      title: payload.title,
      message: messagePayload,
    });

    // Fan out to registered channels
    for (const channel of this.channels) {
      try {
        await channel.send(payload);
      } catch (err) {
        console.error(`[Notification] Channel ${channel.name} failed:`, err);
      }
    }
  }

  async getNotifications(limit: number = 20): Promise<AppNotification[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
      
    if (!data) return [];
    
    return data.map(n => {
      let text = n.message;
      let type = undefined;
      let action_url = undefined;
      try {
        const parsed = JSON.parse(n.message);
        text = parsed.text || n.message;
        type = parsed.type;
        action_url = parsed.action_url;
      } catch {
        // Not JSON
      }
      return { ...n, message: text, type, action_url };
    });
  }

  async markAsRead(id: string): Promise<void> {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }

  async markAllAsRead(): Promise<void> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
  }
}

export const notificationService = new NotificationService();
