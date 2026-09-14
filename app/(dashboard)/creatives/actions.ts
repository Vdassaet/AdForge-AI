"use server";

import {
  usageService,
  UsageLimitExceededError,
  RateLimitExceededError,
  UsageStatus,
} from "@/lib/services/billing/usage";
import { createClient } from "@/lib/supabase/server";

export interface CreativeData {
  businessName: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
  imageUrl: string;
  aspectRatio: string;
}

export interface SaveCreativeResponse {
  success?: boolean;
  creativeId?: string;
  error?: string;
  limitReached?: boolean;
  rateLimited?: boolean;
  usage?: UsageStatus;
  upgradeRequired?: boolean;
}

export async function saveCreativeAction(
  creativeData: CreativeData,
  organizationId = "demo-org-1",
  planId = "free"
): Promise<SaveCreativeResponse> {
  try {
    if (process.env.NODE_ENV !== "test" && !organizationId.startsWith("org_") && !organizationId.startsWith("demo")) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { error: "Unauthorized. You must be logged in to save creatives." };
      }
    }

    // 1. Quota & abuse enforcement (never silently fail)
    await usageService.assertCanPerformAction(organizationId, "creative", planId);

    // 2. Generate simulated ID / database entry
    const creativeId = `cr_${Date.now()}`;

    // 3. Every usage event must be recorded
    await usageService.recordUsage(organizationId, "creative", {
      creativeId,
      headline: creativeData.headline,
      aspectRatio: creativeData.aspectRatio,
      cta: creativeData.cta,
      imageUrl: creativeData.imageUrl,
    });

    const currentCount = usageService.getUsageCount(organizationId, "creative");
    const usage = usageService.checkUsage(planId, "creative", currentCount);

    return {
      success: true,
      creativeId,
      usage,
    };
  } catch (error) {
    if (error instanceof UsageLimitExceededError) {
      console.warn(`[Creative Blocked] ${error.message}`);
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
      error: error instanceof Error ? error.message : "Failed to save creative.",
    };
  }
}

export async function getCreativeUsageAction(
  organizationId = "demo-org-1",
  planId = "free"
): Promise<UsageStatus> {
  const currentCount = usageService.getUsageCount(organizationId, "creative");
  return usageService.checkUsage(planId, "creative", currentCount);
}
