import { z } from 'zod';

export const CreateCategoryRequestSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Mã lĩnh vực phải có ít nhất 2 ký tự')
    .max(50, 'Mã lĩnh vực tối đa 50 ký tự')
    .toUpperCase(),
  name: z
    .string()
    .trim()
    .min(2, 'Tên lĩnh vực phải có ít nhất 2 ký tự')
    .max(255, 'Tên lĩnh vực tối đa 255 ký tự'),
  description: z.string().trim().max(500).optional().nullable(),
});

export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;
