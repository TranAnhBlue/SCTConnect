import { z } from 'zod';

export const CreateVillageRequestSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Mã Thôn / TDP phải có ít nhất 2 ký tự')
    .max(50, 'Mã Thôn / TDP tối đa 50 ký tự')
    .toUpperCase(),
  name: z
    .string()
    .trim()
    .min(2, 'Tên Thôn / TDP phải có ít nhất 2 ký tự')
    .max(100, 'Tên Thôn / TDP tối đa 100 ký tự'),
});

export type CreateVillageRequest = z.infer<typeof CreateVillageRequestSchema>;
