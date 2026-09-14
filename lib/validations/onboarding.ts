import { z } from "zod";

export const onboardingSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  category: z.string().min(2, "Category is required"),
  services: z.array(z.string()).min(1, "At least one service is required"),
  serviceAreas: z.array(z.string()).min(1, "At least one service area is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  website: z.string().url("Valid URL is required").optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  photos: z.array(z.string().url()).optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
