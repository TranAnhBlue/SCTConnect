import { z } from 'zod';

export const UpdateUserStatusRequestSchema = z.object({
  isActive: z.boolean({
    message: 'Trạng thái hoạt động là bắt buộc (true/false)',
  }),
});

export type UpdateUserStatusRequest = z.infer<
  typeof UpdateUserStatusRequestSchema
>;
