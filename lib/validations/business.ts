import { z } from "zod";

export const businessProfileSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  legalBusinessName: z.string().optional(),
  businessDescription: z.string().optional(),
  industry: z.string().optional(),
  businessCategory: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  serviceRadius: z.number().min(0).optional(),
  yearsInBusiness: z.number().min(0).optional(),
  licenseInformation: z.string().optional(),
  insuranceInformation: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().optional(),
  startingPrice: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
});

export const serviceAreaSchema = z.object({
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().optional(),
  radiusMiles: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
});

export type BusinessProfileData = z.infer<typeof businessProfileSchema>;
export type ServiceData = z.infer<typeof serviceSchema>;
export type ServiceAreaData = z.infer<typeof serviceAreaSchema>;
