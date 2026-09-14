"use server";

import { z } from "zod";
import {
  type PlanId,
  type PlanConfig,
  type PlanLimits,
} from "@/lib/services/billing/plans";
import { usageService } from "@/lib/services/billing/usage";
import { revalidatePath } from "next/cache";

const planLimitsSchema = z.object({
  ai_generations: z.number().int().min(-1, "Limit must be -1 (unlimited) or >= 0"),
  creatives: z.number().int().min(-1, "Limit must be -1 (unlimited) or >= 0"),
  campaigns: z.number().int().min(-1, "Limit must be -1 (unlimited) or >= 0"),
  ad_accounts: z.number().int().min(-1, "Limit must be -1 (unlimited) or >= 0"),
  leads: z.number().int().min(-1, "Limit must be -1 (unlimited) or >= 0"),
});

function safeRevalidate(path: string): void {
  try {
    revalidatePath(path);
  } catch {
    // Gracefully ignore when invoked outside Next.js request context (e.g. unit tests)
  }
}

export async function getPlanConfigurationsAction(): Promise<Record<PlanId, PlanConfig>> {
  return usageService.getPlanConfigurations();
}

export async function updatePlanLimitsAction(
  planId: PlanId,
  limits: Partial<PlanLimits>
): Promise<{ success: boolean; plan?: PlanConfig; error?: string }> {
  try {
    const parsed = planLimitsSchema.partial().safeParse(limits);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }

    const updatedPlan = usageService.updatePlanLimits(planId, parsed.data);
    safeRevalidate("/settings/plan-limits");
    safeRevalidate("/billing");

    return {
      success: true,
      plan: updatedPlan,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update plan limits.",
    };
  }
}

export async function resetPlanLimitsAction(): Promise<{
  success: boolean;
  plans: Record<PlanId, PlanConfig>;
}> {
  usageService.resetPlanLimitsToDefaults();
  safeRevalidate("/settings/plan-limits");
  safeRevalidate("/billing");

  return {
    success: true,
    plans: usageService.getPlanConfigurations(),
  };
}
