import { z } from 'zod';
import { IsoDateSchema } from '../../../common/schemas';

export const UserOrganizationSummarySchema = z
  .object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    type: z.string().optional(),
  })
  .nullable();

export const UserVillageSummarySchema = z
  .object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
  })
  .nullable();

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  phone: z.string(),
  fullName: z.string(),
  villageId: z.string().uuid().nullable().optional(),
  village: UserVillageSummarySchema.optional(),
  userType: z.string(),
  organizationId: z.string().uuid().nullable().optional(),
  organization: UserOrganizationSummarySchema.optional(),
  isActive: z.boolean(),
  lastLoginAt: IsoDateSchema.nullable().optional(),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema.optional(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserOrganizationSummary = z.infer<
  typeof UserOrganizationSummarySchema
>;
export type UserVillageSummary = z.infer<typeof UserVillageSummarySchema>;
