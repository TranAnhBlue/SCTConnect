import { z } from 'zod';
import { IsoDateSchema } from '../../../common/schemas';

export const OrganizationResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  type: z.string(),
  isActive: z.boolean(),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema.optional(),
});

export const OrganizationListResponseSchema = z.array(
  OrganizationResponseSchema,
);

export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>;
export type OrganizationListResponse = OrganizationResponse[];
