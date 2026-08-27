import { z } from 'zod';
import {
  UserResponseSchema,
  PrimaryOrganizationResponseSchema,
  UserOrganizationResponseSchema,
} from '../../../users/schemas/responses/user.response.schema';

export const UserProfileResponseSchema = UserResponseSchema.extend({
  activeOrganization: PrimaryOrganizationResponseSchema.optional(),
  organizations: z.array(UserOrganizationResponseSchema).optional(),
  permissions: z.array(z.string()),
});

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
