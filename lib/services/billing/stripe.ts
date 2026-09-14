/**
 * Stripe Billing Service
 * 
 * All Stripe operations are server-side only.
 * Secret keys are NEVER exposed to the frontend.
 * Price IDs are loaded from environment variables.
 */

import {
  type PlanConfig,
  type PlanLimits,
  type PlanId,
  PLANS,
  getPlan,
} from "./plans";

export type { PlanConfig, PlanLimits, PlanId };
export { PLANS, getPlan };

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

export interface SubscriptionDetails {
  id?: string;
  organizationId: string;
  plan: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

/**
 * Server-side Stripe Billing Service
 * Never called directly with client-controlled secrets.
 */
export class StripeService {
  async getSubscription(organizationId: string): Promise<SubscriptionDetails> {
    // In production: query `subscriptions` table by organizationId
    return {
      organizationId,
      plan: "free",
      status: "active",
      cancelAtPeriodEnd: false,
    };
  }

  async createCheckoutSession(organizationId: string, planId: string): Promise<{ url: string | null }> {
    console.log(`[Stripe] Checkout requested for org: ${organizationId}, plan: ${planId}`);
    if (!isStripeConfigured()) {
      return { url: null };
    }
    const plan = getPlan(planId);
    if (!plan.stripePriceId) {
      throw new Error(`Price not configured for plan: ${planId}`);
    }
    return { url: "https://checkout.stripe.com/demo" };
  }

  async createPortalSession(organizationId: string): Promise<{ url: string | null }> {
    console.log(`[Stripe] Portal requested for org: ${organizationId}`);
    if (!isStripeConfigured()) {
      return { url: null };
    }
    return { url: "https://billing.stripe.com/demo" };
  }

  async cancelSubscription(organizationId: string): Promise<{ success: boolean }> {
    console.log(`[Stripe] Cancel subscription requested for org: ${organizationId}`);
    return { success: true };
  }
}

export const stripeService = new StripeService();

