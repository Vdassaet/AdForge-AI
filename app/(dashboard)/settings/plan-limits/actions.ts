"use server";

import { z } from "zod";
import {
  type PlanId,
  type PlanConfig,
  type PlanLimits,
} from "@/lib/services/billing/plans";
import { usageService } from "@/lib/services/billing/usage";
import { revalidatePath } from "next/cache";
import { getAuthContext, assertRole, AuthError } from "@/lib/auth/auth-context";

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
  // Read-only — any authenticated user can view plan configs
  await getAuthContext();
  return usageService.getPlanConfigurations();
}

/**
 * Updates plan limits. Restricted to organization owners and admins only.
 */
export async function updatePlanLimitsAction(
  planId: PlanId,
  limits: Partial<PlanLimits>
): Promise<{ success: boolean; plan?: PlanConfig; error?: string }> {
  try {
    // Auth: must be owner or admin
    const ctx = await getAuthContext();
    assertRole(ctx, ["owner", "admin"]);

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
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update plan limits.",
    };
  }
}

/**
 * Resets plan limits to defaults. Restricted to organization owners and admins only.
 */
export async function resetPlanLimitsAction(): Promise<{
  success: boolean;
  plans: Record<PlanId, PlanConfig>;
}> {
  const ctx = await getAuthContext();
  assertRole(ctx, ["owner", "admin"]);

  usageService.resetPlanLimitsToDefaults();
  safeRevalidate("/settings/plan-limits");
  safeRevalidate("/billing");

  return {
    success: true,
    plans: usageService.getPlanConfigurations(),
  };
}
