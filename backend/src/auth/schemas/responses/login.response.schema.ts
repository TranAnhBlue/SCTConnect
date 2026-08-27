import { z } from 'zod';
import {
  UserResponseSchema,
  PrimaryOrganizationResponseSchema,
  UserOrganizationResponseSchema,
} from '../../../users/schemas/responses/user.response.schema';
import { AuthTokensResponseSchema } from './auth-tokens.response.schema';

export const LoginResponseSchema = z.object({
  user: UserResponseSchema,
  activeOrganization: PrimaryOrganizationResponseSchema.optional(),
  organizations: z.array(UserOrganizationResponseSchema).optional(),
  permissions: z.array(z.string()),
  tokens: AuthTokensResponseSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
