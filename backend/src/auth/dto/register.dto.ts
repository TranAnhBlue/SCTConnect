import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RegisterSchema = z
  .object({
    phone: z
      .string()
      .min(1, 'Số điện thoại là bắt buộc')
      .regex(/^(03|05|07|08|09)\d{8}$/, 'Số điện thoại không đúng định dạng Việt Nam (10 số)'),
    fullName: z
      .string()
      .trim()
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
      .max(255, 'Họ và tên tối đa 255 ký tự'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự')
      .max(100, 'Mật khẩu tối đa 100 ký tự'),
    confirmPassword: z
      .string()
      .min(8, 'Mật khẩu xác nhận phải chứa ít nhất 8 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập',
    path: ['confirmPassword'],
  });

export class RegisterDTO extends createZodDto(RegisterSchema) {}
