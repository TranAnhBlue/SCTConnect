import { z } from 'zod';

export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Số điện thoại là bắt buộc')
  .regex(
    /^(03|05|07|08|09)\d{8}$/,
    'Số điện thoại không đúng định dạng Việt Nam',
  );

export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải chứa ít nhất 8 ký tự')
  .max(128, 'Mật khẩu tối đa 128 ký tự');
