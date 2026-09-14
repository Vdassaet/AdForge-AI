import { 
  MetaService, 
  MetaOAuthService, 
  MetaCampaignService, 
  MetaAdSetService, 
  MetaAdService, 
  MetaInsightsService, 
  MetaLeadService 
} from "./types";

export class MockMetaService implements MetaService {
  oauth: MetaOAuthService = {
    getAuthorizationUrl: (state) => `/api/auth/meta/callback?code=mock_code&state=${state}`,
    exchangeCodeForToken: async () => ({ accessToken: "mock_token_123", expiresIn: 3600 }),
    verifyConnection: async () => true,
  };

  campaigns: MetaCampaignService = {
    createCampaign: async () => {
      console.log("[Mock Meta API] Created Campaign");
      return { id: "mock_campaign_id" };
    },
    getCampaigns: async () => []
  };

  adSets: MetaAdSetService = {
    createAdSet: async () => {
      console.log("[Mock Meta API] Created AdSet");
      return { id: "mock_adset_id" };
    }
  };

  ads: MetaAdService = {
    createAd: async () => {
      console.log("[Mock Meta API] Created Ad");
      return { id: "mock_ad_id" };
    }
  };

  insights: MetaInsightsService = {
    getInsights: async () => ({ impressions: 1000, clicks: 50, spend: 10.5 })
  };

  leads: MetaLeadService = {
    getLeads: async () => []
  };
}
