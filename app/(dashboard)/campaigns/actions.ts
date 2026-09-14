"use server";

import {
  usageService,
  UsageLimitExceededError,
  RateLimitExceededError,
  UsageStatus,
} from "@/lib/services/billing/usage";
import { createClient } from "@/lib/supabase/server";

export interface CampaignPublishData {
  name: string;
  objective: string;
  service: string;
  location: string;
  dailyBudget: number;
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
}

export async function publishCampaignAction(
  campaignData: CampaignPublishData,
  organizationId = "demo-org-1",
  planId = "free"
): Promise<PublishCampaignResponse> {
  try {
    if (process.env.NODE_ENV !== "test" && !organizationId.startsWith("org_") && !organizationId.startsWith("demo")) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { error: "Unauthorized. You must be logged in to publish campaigns." };
      }
    }

    // 1. Quota & abuse enforcement (never silently fail)
    await usageService.assertCanPerformAction(organizationId, "campaign", planId);

    // 2. Perform publishing logic / simulated Meta sync
    const campaignId = `camp_${Date.now()}`;

    // 3. Every usage event must be recorded
    await usageService.recordUsage(organizationId, "campaign", {
      campaignId,
      name: campaignData.name,
      objective: campaignData.objective,
      service: campaignData.service,
      location: campaignData.location,
      dailyBudget: campaignData.dailyBudget,
      startDate: campaignData.startDate,
    });

    const currentCount = usageService.getUsageCount(organizationId, "campaign");
    const usage = usageService.checkUsage(planId, "campaign", currentCount);

    return {
      success: true,
      campaignId,
      usage,
    };
  } catch (error) {
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

export async function getCampaignUsageAction(
  organizationId = "demo-org-1",
  planId = "free"
): Promise<UsageStatus> {
  const currentCount = usageService.getUsageCount(organizationId, "campaign");
  return usageService.checkUsage(planId, "campaign", currentCount);
}
