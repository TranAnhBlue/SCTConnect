import { z } from 'zod';
import { UserResponseSchema } from '../../../users/schemas/responses/user.response.schema';
import { AuthTokensResponseSchema } from './auth-tokens.response.schema';

export const LoginResponseSchema = z.object({
  user: UserResponseSchema,
  tokens: AuthTokensResponseSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
