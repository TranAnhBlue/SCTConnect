import { z } from 'zod';

export type IsoDate = Date | string;

export const IsoDateSchema = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return val;
  return val;
}, z.string()) as unknown as z.ZodType<IsoDate>;

export const UserOrganizationResponseSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid().optional(),
  orgCode: z.string().optional(),
  orgName: z.string().optional(),
  titleName: z.string(),
  roleCode: z.string().optional(),
  isPrimary: z.boolean(),
  joinedAt: IsoDateSchema.optional(),
});

export const PrimaryOrganizationResponseSchema = z
  .object({
    orgId: z.string().uuid(),
    orgCode: z.string(),
    orgName: z.string(),
    titleName: z.string(),
    roleCode: z.string().optional(),
  })
  .nullable();

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  phone: z.string(),
  fullName: z.string(),
  userType: z.string(),
  avatarUrl: z.string().nullable(),
  isActive: z.boolean(),
  lastLoginAt: IsoDateSchema.nullable().optional(),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema.optional(),
  primaryOrganization: PrimaryOrganizationResponseSchema.optional(),
  organizations: z.array(UserOrganizationResponseSchema).optional(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserOrganizationResponse = z.infer<
  typeof UserOrganizationResponseSchema
>;
export type PrimaryOrganizationResponse = z.infer<
  typeof PrimaryOrganizationResponseSchema
>;
