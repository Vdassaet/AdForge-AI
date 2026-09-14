import { z } from "zod";

export const campaignStatusEnum = z.enum([
  "draft",
  "review",
  "ready",
  "publishing",
  "active",
  "paused",
  "completed",
  "failed"
]);

export const campaignObjectiveEnum = z.enum([
  "Leads",
  "Website Traffic",
  "Calls",
  "Messages",
  "Awareness"
]);

export const campaignSchema = z.object({
  name: z.string().min(3, "Campaign name is required"),
  objective: campaignObjectiveEnum,
  service: z.string().min(2, "Service is required"),
  location: z.string().min(2, "Location is required"),
  audience: z.any().optional(), // Could be more strictly typed based on requirements
  creativeId: z.string().uuid("Invalid creative ID").optional(),
  cta: z.string().optional(),
  dailyBudget: z.number().min(5, "Minimum daily budget is $5").optional(),
  lifetimeBudget: z.number().min(50, "Minimum lifetime budget is $50").optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: campaignStatusEnum.default("draft")
}).refine(data => data.dailyBudget || data.lifetimeBudget, {
  message: "Either daily or lifetime budget must be provided",
  path: ["dailyBudget"]
}).refine(data => {
  if (data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

export type CampaignData = z.infer<typeof campaignSchema>;
