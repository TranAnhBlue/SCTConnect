import { z } from 'zod';
import { passwordSchema, phoneSchema } from './common.schema';

export const RegisterRequestSchema = z
  .object({
    phone: phoneSchema,
    fullName: z
      .string()
      .trim()
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
      .max(255, 'Họ và tên tối đa 255 ký tự'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .check(({ value, issues }) => {
    if (value.password !== value.confirmPassword) {
      issues.push({
        code: 'custom',
        input: value.confirmPassword,
        path: ['confirmPassword'],
        message: 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập',
      });
    }
  });

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
