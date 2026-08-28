import { z } from 'zod';
import { IsoDateSchema } from '../../../common/schemas';

export const CategoryResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema.optional(),
});

export const CategoryListResponseSchema = z.array(CategoryResponseSchema);

export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type CategoryListResponse = CategoryResponse[];
