import { z } from 'zod';

export const QueryVillagesRequestSchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, 'Từ khóa tìm kiếm không được vượt quá 100 ký tự')
    .optional(),
});

export type QueryVillagesRequest = z.infer<typeof QueryVillagesRequestSchema>;
