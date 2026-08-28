import { z } from 'zod';
import { FeedbackStatus } from '../../entities/feedback.entity';

export const QueryFeedbacksRequestSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  targetOrganizationId: z.string().uuid().optional(),
  incidentVillageId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  status: z
    .enum([
      FeedbackStatus.PENDING,
      FeedbackStatus.RECEIVED,
      FeedbackStatus.REJECTED,
    ])
    .optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export type QueryFeedbacksRequest = z.infer<typeof QueryFeedbacksRequestSchema>;
