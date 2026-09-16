"use server";

import {
  usageService,
  UsageLimitExceededError,
  RateLimitExceededError,
  UsageStatus,
} from "@/lib/services/billing/usage";
import { getAuthContext, AuthError } from "@/lib/auth/auth-context";

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

/**
 * Saves a creative for the authenticated user's organization.
 *
 * organizationId and planId are resolved server-side from the Supabase
 * session — never accepted from client arguments.
 */
export async function saveCreativeAction(
  creativeData: CreativeData
): Promise<SaveCreativeResponse> {
  try {
    // Auth: resolve org + plan from session (never from client)
    const ctx = await getAuthContext();

    // 1. Quota & abuse enforcement (never silently fail)
    await usageService.assertCanPerformAction(ctx.organizationId, "creative", ctx.planId);

    // 2. Generate simulated ID / database entry
    const creativeId = `cr_${Date.now()}`;

    // 3. Every usage event must be recorded
    await usageService.recordUsage(ctx.organizationId, "creative", {
      creativeId,
      headline: creativeData.headline,
      aspectRatio: creativeData.aspectRatio,
      cta: creativeData.cta,
      imageUrl: creativeData.imageUrl,
    });

    const currentCount = usageService.getUsageCount(ctx.organizationId, "creative");
    const usage = usageService.checkUsage(ctx.planId, "creative", currentCount);

    return {
      success: true,
      creativeId,
      usage,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }

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

/**
 * Returns the creative usage status for the authenticated user's organization.
 */
export async function getCreativeUsageAction(): Promise<UsageStatus> {
  const ctx = await getAuthContext();
  const currentCount = usageService.getUsageCount(ctx.organizationId, "creative");
  return usageService.checkUsage(ctx.planId, "creative", currentCount);
}
