/**
 * Centralized SaaS Plan Configuration
 *
 * DO NOT hardcode plan limits anywhere in the application.
 * All feature limits, pricing, and capabilities are configured here.
 */

export type PlanId = "free" | "starter" | "pro" | "agency";

export type UsageEventType =
  | "ai_generation"
  | "creative"
  | "campaign"
  | "ad_account"
  | "lead";

export interface PlanLimits {
  ai_generations: number; // monthly quota (-1 = unlimited/custom)
  creatives: number;      // monthly quota (-1 = unlimited/custom)
  campaigns: number;      // active/published campaigns (-1 = unlimited/custom)
  ad_accounts: number;    // connected ad accounts
  leads: number;          // monthly captured leads (-1 = unlimited)
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  stripePriceId: string | null;
  price: number; // USD per month
  limits: PlanLimits;
  features: string[];
  isCustom?: boolean;
  recommendedNextPlan?: PlanId;
}

/**
 * Baseline Default Plan Definitions
 * Exactly matching the SaaS specification:
 * - Free: 10 AI generations, 5 creatives, 1 campaign
 * - Starter: 100 AI generations, 50 creatives, 5 campaigns
 * - Pro: 500 AI generations, 250 creatives, 25 campaigns
 * - Agency: Custom (default unlimited / flexible)
 */
export const DEFAULT_PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    stripePriceId: null,
    price: 0,
    limits: {
      ai_generations: 10,
      creatives: 5,
      campaigns: 1,
      ad_accounts: 1,
      leads: 50,
    },
    features: [
      "10 AI generations/month",
      "5 creatives/month",
      "1 campaign",
      "Basic analytics",
      "Standard email support",
    ],
    recommendedNextPlan: "starter",
  },
  starter: {
    id: "starter",
    name: "Starter",
    stripePriceId: process.env.STRIPE_PRICE_STARTER || null,
    price: 49,
    limits: {
      ai_generations: 100,
      creatives: 50,
      campaigns: 5,
      ad_accounts: 2,
      leads: 500,
    },
    features: [
      "100 AI generations/month",
      "50 creatives/month",
      "5 campaigns",
      "2 connected ad accounts",
      "A/B experiment builder",
      "Priority analytics",
    ],
    recommendedNextPlan: "pro",
  },
  pro: {
    id: "pro",
    name: "Pro",
    stripePriceId: process.env.STRIPE_PRICE_PRO || null,
    price: 149,
    limits: {
      ai_generations: 500,
      creatives: 250,
      campaigns: 25,
      ad_accounts: 5,
      leads: 5000,
    },
    features: [
      "500 AI generations/month",
      "250 creatives/month",
      "25 campaigns",
      "5 connected ad accounts",
      "AI optimization agent",
      "Call tracking & CRM automation",
      "Dedicated account manager",
    ],
    recommendedNextPlan: "agency",
  },
  agency: {
    id: "agency",
    name: "Agency",
    stripePriceId: process.env.STRIPE_PRICE_AGENCY || null,
    price: 499,
    isCustom: true,
    limits: {
      ai_generations: -1, // Custom / Unlimited
      creatives: -1,      // Custom / Unlimited
      campaigns: -1,      // Custom / Unlimited
      ad_accounts: -1,    // Custom / Unlimited
      leads: -1,          // Custom / Unlimited
    },
    features: [
      "Custom AI generations",
      "Custom creatives allocation",
      "Custom campaigns capacity",
      "Unlimited connected accounts",
      "White-label client reporting",
      "Custom integrations & webhook SLA",
    ],
  },
};

/**
 * Feature friendly names and limit key mappings
 */
export const USAGE_FEATURE_CONFIG: Record<
  UsageEventType,
  { label: string; limitKey: keyof PlanLimits; unit: string }
> = {
  ai_generation: {
    label: "AI Generations",
    limitKey: "ai_generations",
    unit: "generations",
  },
  creative: {
    label: "Creatives",
    limitKey: "creatives",
    unit: "creatives",
  },
  campaign: {
    label: "Active Campaigns",
    limitKey: "campaigns",
    unit: "campaigns",
  },
  ad_account: {
    label: "Connected Ad Accounts",
    limitKey: "ad_accounts",
    unit: "accounts",
  },
  lead: {
    label: "Leads Captured",
    limitKey: "leads",
    unit: "leads",
  },
};

/**
 * Dynamic Active Plan State (Admin Configurable)
 * Stores in-memory customized plan limits with fallback to DEFAULT_PLANS.
 */
class PlanConfigurationRegistry {
  private activePlans: Record<PlanId, PlanConfig>;

  constructor() {
    this.activePlans = JSON.parse(JSON.stringify(DEFAULT_PLANS));
  }

  public getPlan(planId: string | PlanId): PlanConfig {
    const key = (planId || "free").toLowerCase() as PlanId;
    return this.activePlans[key] || this.activePlans.free;
  }

  public getAllPlans(): Record<PlanId, PlanConfig> {
    return { ...this.activePlans };
  }

  public updateLimits(planId: PlanId, newLimits: Partial<PlanLimits>): PlanConfig {
    const plan = this.getPlan(planId);
    this.activePlans[planId] = {
      ...plan,
      limits: {
        ...plan.limits,
        ...newLimits,
      },
    };
    return this.activePlans[planId];
  }

  public resetToDefaults(): void {
    this.activePlans = JSON.parse(JSON.stringify(DEFAULT_PLANS));
  }
}

export const planRegistry = new PlanConfigurationRegistry();

// Export the active plans reference (dynamically fetched)
export const PLANS: Record<string, PlanConfig> = new Proxy(DEFAULT_PLANS, {
  get(_target, prop: string) {
    return planRegistry.getPlan(prop);
  },
  ownKeys() {
    return Object.keys(planRegistry.getAllPlans());
  },
  getOwnPropertyDescriptor(_target, prop: string) {
    return {
      enumerable: true,
      configurable: true,
      value: planRegistry.getPlan(prop),
    };
  },
});

export function getPlan(planId: string): PlanConfig {
  return planRegistry.getPlan(planId);
}
