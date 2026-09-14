import { z } from "zod";

export const AssetCategoryEnum = z.enum([
  "Logo",
  "Project",
  "Before & After",
  "Service",
  "Team",
  "Vehicle",
  "Other"
]);

export const assetMetadataSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: AssetCategoryEnum.optional(),
  isFavorite: z.boolean().default(false),
  altText: z.string().optional(),
});

export type AssetMetadataData = z.infer<typeof assetMetadataSchema>;
export type AssetCategory = z.infer<typeof AssetCategoryEnum>;
