import { z } from 'zod';

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token không được để trống'),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
