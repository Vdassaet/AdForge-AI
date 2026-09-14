export interface CallData {
  id: string;
  organization_id: string;
  lead_id?: string;
  campaign_id?: string;
  phone_number: string;
  direction: 'incoming' | 'outgoing';
  status: 'answered' | 'missed' | 'failed' | 'busy';
  duration: number; // in seconds
  recording_url?: string;
  started_at: string;
  ended_at?: string;
}

export interface CallTrackingProvider {
  name: string;
  
  // Provision a new tracking phone number in a specific area code
  provisionNumber(organizationId: string, areaCode: string): Promise<string>;
  
  // Webhook handler for incoming events from the provider (e.g. Twilio)
  handleWebhook(payload: Record<string, unknown>): Promise<void>;
  
  // Sync historical call logs
  syncCallLogs(organizationId: string, startDate: string, endDate: string): Promise<CallData[]>;
}
