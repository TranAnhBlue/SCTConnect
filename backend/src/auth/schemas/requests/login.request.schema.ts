import { z } from 'zod';
import { phoneSchema } from './common.schema';

export const LoginRequestSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Mật khẩu là bắt buộc').max(128),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
