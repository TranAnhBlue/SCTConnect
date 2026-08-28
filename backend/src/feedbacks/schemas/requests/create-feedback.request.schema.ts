import { z } from 'zod';

export const CreateFeedbackRequestSchema = z.object({
  targetOrganizationId: z.string().uuid('ID Hội tiếp nhận không hợp lệ'),
  incidentVillageId: z.string().uuid('ID Thôn / Tổ dân phố không hợp lệ'),
  categoryId: z.string().uuid('ID Lĩnh vực phản ánh không hợp lệ'),
  address: z.string().trim().max(500).optional().nullable(),
  title: z
    .string()
    .trim()
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
    .max(255, 'Tiêu đề tối đa 255 ký tự'),
  content: z
    .string()
    .trim()
    .min(10, 'Nội dung phản ánh phải có ít nhất 10 ký tự'),
  attachments: z
    .array(z.string().url('Đường dẫn tệp đính kèm không hợp lệ'))
    .optional()
    .default([]),
});

export type CreateFeedbackRequest = z.infer<typeof CreateFeedbackRequestSchema>;
