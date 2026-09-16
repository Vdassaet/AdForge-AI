import { MetaService } from "./types";

interface MetaTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: { message?: string };
}

export class MetaConfigurationError extends Error {
  constructor(message = "Meta integration is not configured.") {
    super(message);
    this.name = "MetaConfigurationError";
  }
}

/** Minimal live client. Campaign publishing remains intentionally separate from OAuth. */
export class LiveMetaService implements MetaService {
  private readonly appId: string;
  private readonly appSecret: string;
  private readonly version: string;

  constructor() {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    if (!appId || !appSecret) throw new MetaConfigurationError();
    this.appId = appId;
    this.appSecret = appSecret;
    this.version = process.env.META_API_VERSION || "v22.0";
  }

  oauth = {
    getAuthorizationUrl: (state: string) => {
      const redirectUri = process.env.META_REDIRECT_URI;
      if (!redirectUri) throw new MetaConfigurationError("META_REDIRECT_URI is not configured.");
      const params = new URLSearchParams({
        client_id: this.appId,
        redirect_uri: redirectUri,
        state,
        response_type: "code",
        scope: "ads_management,ads_read,business_management",
      });
      return `https://www.facebook.com/${this.version}/dialog/oauth?${params.toString()}`;
    },

    exchangeCodeForToken: async (code: string, redirectUri: string) => {
      const params = new URLSearchParams({
        client_id: this.appId,
        client_secret: this.appSecret,
        redirect_uri: redirectUri,
        code,
      });
      const response = await fetch(`https://graph.facebook.com/${this.version}/oauth/access_token?${params}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as MetaTokenResponse;
      if (!response.ok || !payload.access_token) {
        throw new Error(payload.error?.message || "Meta did not return an access token.");
      }
      return { accessToken: payload.access_token, expiresIn: payload.expires_in ?? 0 };
    },

    verifyConnection: async () => false,
  };

  campaigns = {
    createCampaign: async () => {
      throw new Error("Meta campaign publishing is not implemented yet.");
    },
    getCampaigns: async () => [],
  };
  adSets = { createAdSet: async () => { throw new Error("Meta ad set publishing is not implemented yet."); } };
  ads = { createAd: async () => { throw new Error("Meta ad publishing is not implemented yet."); } };
  insights = { getInsights: async () => { throw new Error("Meta insights sync is not implemented yet."); } };
  leads = { getLeads: async () => { throw new Error("Meta lead sync is not implemented yet."); } };
}
