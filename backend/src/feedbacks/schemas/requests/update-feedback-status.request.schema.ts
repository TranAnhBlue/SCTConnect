import { z } from 'zod';
import { FeedbackStatus } from '../../entities/feedback.entity';

export const UpdateFeedbackStatusRequestSchema = z.object({
  status: z.enum([FeedbackStatus.RECEIVED, FeedbackStatus.REJECTED]),
});

export type UpdateFeedbackStatusRequest = z.infer<
  typeof UpdateFeedbackStatusRequestSchema
>;
