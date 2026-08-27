import { z } from 'zod';

export const AuthTokensResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export type AuthTokensResponse = z.infer<typeof AuthTokensResponseSchema>;
