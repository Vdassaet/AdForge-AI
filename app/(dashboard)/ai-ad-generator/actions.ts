"use server";

import { PromptInput, AdGenerationOutput, promptInputSchema } from "@/lib/services/ai/schema";
import { getAIProvider } from "@/lib/services/ai";
import {
  usageService,
  UsageLimitExceededError,
  RateLimitExceededError,
  UsageStatus,
} from "@/lib/services/billing/usage";
import { getAuthContext, AuthError } from "@/lib/auth/auth-context";

export interface GenerateAdResponse {
  error?: string;
  data?: AdGenerationOutput;
  limitReached?: boolean;
  rateLimited?: boolean;
  usage?: UsageStatus;
  upgradeRequired?: boolean;
}

/**
 * Generates AI ad copy for the authenticated user's organization.
 *
 * organizationId and planId are resolved server-side from the Supabase
 * session — never accepted from client arguments.
 */
export async function generateAdAction(
  params: PromptInput
): Promise<GenerateAdResponse> {
  try {
    // Auth: resolve org + plan from session (never from client)
    const ctx = await getAuthContext();
    const parsedParams = promptInputSchema.safeParse(params);
    if (!parsedParams.success) {
      return { error: parsedParams.error.issues[0]?.message || "Invalid ad-generation request." };
    }

    // 1. Abuse & Quota Enforcement (never silently fail)
    await usageService.assertCanPerformAction(ctx.organizationId, "ai_generation", ctx.planId);

    // 2. Perform Generation via configured AI Provider
    const aiProvider = getAIProvider();
    const results = await aiProvider.generateAdCopy(parsedParams.data);

    // 3. Every usage event must be recorded
    await usageService.recordUsage(ctx.organizationId, "ai_generation", {
      business: parsedParams.data.business,
      service: parsedParams.data.service,
      location: parsedParams.data.location,
      targetCustomer: parsedParams.data.targetCustomer,
      tone: parsedParams.data.tone,
      modelUsed: aiProvider.modelName,
      headlinePreview: results.headlines?.[0] || "",
    });

    const currentCount = usageService.getUsageCount(ctx.organizationId, "ai_generation");
    const usage = usageService.checkUsage(ctx.planId, "ai_generation", currentCount);

    return {
      data: results,
      usage,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }

    if (error instanceof UsageLimitExceededError) {
      console.warn(`[AI Generation Blocked] ${error.message}`);
      return {
        error: error.message,
        limitReached: true,
        upgradeRequired: true,
        usage: error.usage,
      };
    }

    if (error instanceof RateLimitExceededError) {
      console.warn(`[AI Generation Rate Limited] ${error.message}`);
      return {
        error: error.message,
        rateLimited: true,
      };
    }

    console.error("Failed to generate ad copy", error);
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
