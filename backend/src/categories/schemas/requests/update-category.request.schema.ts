import { z } from 'zod';

export const UpdateCategoryRequestSchema = z.object({
  name: z.string().trim().min(2).max(255).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;
