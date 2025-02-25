import { z } from "zod";

export const appreciationSchema = z.object({
  id: z.number(),
  content: z.string(),
  categoryId: z.number().optional(),
  category: z
    .object({
      id: z.number(),
      name: z.string(),
      isActive: z.boolean(),
    })
    .nullish(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const appreciationListSchema = z.array(appreciationSchema);
export type Appreciation = z.infer<typeof appreciationSchema>;

export const appreciationCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
  appreciations: z.array(appreciationSchema).nullish(),
});

export type AppreciationCategory = z.infer<typeof appreciationCategorySchema>;
export const appreciationCategoriesSchema = z.array(appreciationCategorySchema);
