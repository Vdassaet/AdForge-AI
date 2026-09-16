"use server";

import {
  usageService,
  UsageLimitExceededError,
  RateLimitExceededError,
  UsageStatus,
} from "@/lib/services/billing/usage";
import { getAuthContext, AuthError } from "@/lib/auth/auth-context";
import { validateCampaignSpend } from "@/lib/services/campaigns/spend-controls";

export interface CampaignPublishData {
  name: string;
  objective: string;
  service: string;
  location: string;
  dailyBudget: number;
  totalBudget: number;
  currency: string;
  spendAcknowledged: boolean;
  startDate: string;
}

export interface PublishCampaignResponse {
  success?: boolean;
  campaignId?: string;
  error?: string;
  limitReached?: boolean;
  rateLimited?: boolean;
  usage?: UsageStatus;
  upgradeRequired?: boolean;
  simulated?: boolean;
}

/**
 * Publishes a campaign for the authenticated user's organization.
 *
 * organizationId and planId are resolved server-side from the Supabase
 * session — never accepted from client arguments.
 */
export async function publishCampaignAction(
  campaignData: CampaignPublishData
): Promise<PublishCampaignResponse> {
  try {
    // Auth: resolve org + plan from session (never from client)
    const ctx = await getAuthContext();

    const spendCheck = validateCampaignSpend({
      dailyBudget: campaignData.dailyBudget,
      totalBudget: campaignData.totalBudget,
      currency: campaignData.currency,
      spendAcknowledged: campaignData.spendAcknowledged,
    });
    if (!spendCheck.ok) {
      return { error: spendCheck.error };
    }

    // 1. Quota & abuse enforcement (never silently fail)
    await usageService.assertCanPerformAction(ctx.organizationId, "campaign", ctx.planId);

    // 2. Perform publishing logic / simulated Meta sync
    const campaignId = `camp_${Date.now()}`;

    // 3. Every usage event must be recorded
    await usageService.recordUsage(ctx.organizationId, "campaign", {
      campaignId,
      name: campaignData.name,
      objective: campaignData.objective,
      service: campaignData.service,
      location: campaignData.location,
      dailyBudget: campaignData.dailyBudget,
      totalBudget: campaignData.totalBudget,
      currency: campaignData.currency,
      startDate: campaignData.startDate,
    });

    const currentCount = usageService.getUsageCount(ctx.organizationId, "campaign");
    const usage = usageService.checkUsage(ctx.planId, "campaign", currentCount);

    return {
      success: true,
      campaignId,
      usage,
      // No advertising-network integration exists yet. Never represent this
      // local validation as a live, billable campaign.
      simulated: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }

    if (error instanceof UsageLimitExceededError) {
      console.warn(`[Campaign Blocked] ${error.message}`);
      return {
        error: error.message,
        limitReached: true,
        upgradeRequired: true,
        usage: error.usage,
      };
    }

    if (error instanceof RateLimitExceededError) {
      return {
        error: error.message,
        rateLimited: true,
      };
    }

    return {
      error: error instanceof Error ? error.message : "Failed to publish campaign.",
    };
  }
}

/**
 * Returns the campaign usage status for the authenticated user's organization.
 */
export async function getCampaignUsageAction(): Promise<UsageStatus> {
  const ctx = await getAuthContext();
  const currentCount = usageService.getUsageCount(ctx.organizationId, "campaign");
  return usageService.checkUsage(ctx.planId, "campaign", currentCount);
}
