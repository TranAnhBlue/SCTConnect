import { z } from 'zod';
import { passwordSchema } from './common.schema';

export const ChangePasswordRequestSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, 'Mật khẩu cũ không được để trống')
      .max(128, 'Mật khẩu cũ tối đa 128 ký tự'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1).max(128),
  })
  .check(({ value, issues }) => {
    const { oldPassword, newPassword, confirmNewPassword } = value;

    if (newPassword !== confirmNewPassword) {
      issues.push({
        code: 'custom',
        input: confirmNewPassword,
        path: ['confirmNewPassword'],
        message: 'Mật khẩu xác nhận không khớp với mật khẩu mới',
      });
    }

    if (oldPassword === newPassword) {
      issues.push({
        code: 'custom',
        input: newPassword,
        path: ['newPassword'],
        message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
      });
    }
  });

export type ChangePasswordRequest = z.infer<
  typeof ChangePasswordRequestSchema
>;
