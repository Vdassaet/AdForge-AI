"use server";

import { PromptInput, AdGenerationOutput } from "@/lib/services/ai/schema";
import { getAIProvider } from "@/lib/services/ai";
import {
  usageService,
  UsageLimitExceededError,
  RateLimitExceededError,
  UsageStatus,
} from "@/lib/services/billing/usage";
import { createClient } from "@/lib/supabase/server";

export interface GenerateAdResponse {
  error?: string;
  data?: AdGenerationOutput;
  limitReached?: boolean;
  rateLimited?: boolean;
  usage?: UsageStatus;
  upgradeRequired?: boolean;
}

export async function generateAdAction(
  params: PromptInput,
  organizationId = "demo-org-1",
  planId = "free"
): Promise<GenerateAdResponse> {
  try {
    if (process.env.NODE_ENV !== "test" && !organizationId.startsWith("org_") && !organizationId.startsWith("demo")) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { error: "Unauthorized. You must be logged in to generate ads." };
      }
    }

    // 1. Abuse & Quota Enforcement (never silently fail)
    await usageService.assertCanPerformAction(organizationId, "ai_generation", planId);

    // 2. Perform Generation via configured AI Provider
    const aiProvider = getAIProvider();
    const results = await aiProvider.generateAdCopy(params);

    // 3. Every usage event must be recorded
    await usageService.recordUsage(organizationId, "ai_generation", {
      business: params.business,
      service: params.service,
      location: params.location,
      targetCustomer: params.targetCustomer,
      tone: params.tone,
      modelUsed: aiProvider.modelName,
      headlinePreview: results.headlines?.[0] || "",
    });

    const currentCount = usageService.getUsageCount(organizationId, "ai_generation");
    const usage = usageService.checkUsage(planId, "ai_generation", currentCount);

    return {
      data: results,
      usage,
    };
  } catch (error) {
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
