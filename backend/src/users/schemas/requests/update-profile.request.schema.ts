import { z } from 'zod';

export const UpdateProfileRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(255, 'Họ và tên tối đa 255 ký tự')
    .optional(),
  villageId: z.string().uuid('ID Thôn không hợp lệ').optional(),
  organizationId: z.string().uuid().nullable().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
