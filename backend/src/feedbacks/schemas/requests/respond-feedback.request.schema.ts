import { z } from 'zod';

export const RespondFeedbackRequestSchema = z.object({
  content: z
    .string()
    .trim()
    .min(5, 'Nội dung phản hồi phải có ít nhất 5 ký tự')
    .max(5000, 'Nội dung phản hồi tối đa 5000 ký tự'),
});

export type RespondFeedbackRequest = z.infer<typeof RespondFeedbackRequestSchema>;
