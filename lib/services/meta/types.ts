// eslint-disable-next-line @typescript-eslint/no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */
// Core types matching the Meta Marketing API

export interface MetaConnection {
  id: string;
  organizationId: string;
  metaUserId: string;
  pageId: string | null;
  adAccountId: string | null;
  status: "connected" | "disconnected" | "expired";
}

export interface MetaOAuthService {
  getAuthorizationUrl(state: string): string;
  exchangeCodeForToken(code: string, redirectUri: string): Promise<{ accessToken: string; expiresIn: number }>;
  verifyConnection(): Promise<boolean>;
}

export interface MetaCampaignService {
  createCampaign(adAccountId: string, data: any): Promise<{ id: string }>;
  getCampaigns(adAccountId: string): Promise<any[]>;
}

export interface MetaAdSetService {
  createAdSet(adAccountId: string, data: any): Promise<{ id: string }>;
}

export interface MetaAdService {
  createAd(adAccountId: string, data: any): Promise<{ id: string }>;
}

export interface MetaInsightsService {
  getInsights(entityId: string, level: "campaign" | "adset" | "ad"): Promise<any>;
}

export interface MetaLeadService {
  getLeads(formId: string): Promise<any[]>;
}

// Master Provider
export interface MetaService {
  oauth: MetaOAuthService;
  campaigns: MetaCampaignService;
  adSets: MetaAdSetService;
  ads: MetaAdService;
  insights: MetaInsightsService;
  leads: MetaLeadService;
}
