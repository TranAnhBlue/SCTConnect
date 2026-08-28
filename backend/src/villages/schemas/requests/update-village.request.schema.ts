import { z } from 'zod';

export const UpdateVillageRequestSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateVillageRequest = z.infer<typeof UpdateVillageRequestSchema>;
