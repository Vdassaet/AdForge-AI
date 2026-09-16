import { z } from "zod";

export const DEFAULT_SPEND_LIMITS = {
  maxDailyBudget: 50,
  maxCampaignBudget: 300,
} as const;

const currencySchema = z.string().regex(/^[A-Z]{3}$/, "Use a three-letter ISO currency code.");

export const campaignSpendSchema = z
  .object({
    dailyBudget: z.number().finite().min(1, "The daily budget must be at least 1."),
    totalBudget: z.number().finite().min(1, "The total campaign budget must be at least 1."),
    currency: currencySchema,
    spendAcknowledged: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (!value.spendAcknowledged) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["spendAcknowledged"],
        message: "You must confirm the advertising budget before continuing.",
      });
    }

    if (value.totalBudget < value.dailyBudget) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["totalBudget"],
        message: "The total budget cannot be lower than the daily budget.",
      });
    }
  });

export type CampaignSpendInput = z.infer<typeof campaignSpendSchema>;

export interface SpendLimits {
  maxDailyBudget: number;
  maxCampaignBudget: number;
}

/**
 * Validates declared spend before a campaign can be sent to an ad network.
 * This is intentionally server-side: browser-only limits can be bypassed.
 */
export function validateCampaignSpend(
  input: CampaignSpendInput,
  limits: SpendLimits = DEFAULT_SPEND_LIMITS
): { ok: true } | { ok: false; error: string } {
  const parsed = campaignSpendSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid campaign budget." };
  }

  if (input.dailyBudget > limits.maxDailyBudget) {
    return {
      ok: false,
      error: `The daily budget exceeds your organization safety limit of ${input.currency} ${limits.maxDailyBudget.toFixed(2)}.`,
    };
  }

  if (input.totalBudget > limits.maxCampaignBudget) {
    return {
      ok: false,
      error: `The total campaign budget exceeds your organization safety limit of ${input.currency} ${limits.maxCampaignBudget.toFixed(2)}.`,
    };
  }

  return { ok: true };
}
