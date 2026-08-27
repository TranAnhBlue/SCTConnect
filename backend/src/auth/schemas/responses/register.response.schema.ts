import { z } from 'zod';
import { UserResponseSchema } from '../../../users/schemas/responses/user.response.schema';
import { AuthTokensResponseSchema } from './auth-tokens.response.schema';

export const RegisterResponseSchema = z.object({
  user: UserResponseSchema,
  tokens: AuthTokensResponseSchema,
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
