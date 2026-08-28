import { z } from 'zod';
import { IsoDateSchema } from '../../../common/schemas';

export const VillageResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema.optional(),
});

export const VillageListResponseSchema = z.array(VillageResponseSchema);

export type VillageResponse = z.infer<typeof VillageResponseSchema>;
export type VillageListResponse = VillageResponse[];
