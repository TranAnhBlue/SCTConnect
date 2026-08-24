import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LoginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(/^(03|05|07|08|09)\d{8}$/, 'Số điện thoại không đúng định dạng Việt Nam'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc'),
});

export class LoginDTO extends createZodDto(LoginSchema) {}
