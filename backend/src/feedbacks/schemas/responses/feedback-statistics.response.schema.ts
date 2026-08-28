import { z } from 'zod';

export const FeedbackCountByGroupSchema = z.object({
  key: z.string(),
  name: z.string(),
  count: z.number(),
});

export const FeedbackStatisticsResponseSchema = z.object({
  totalFeedbacks: z.number(),
  totalPending: z.number(),
  totalReceived: z.number(),
  totalRejected: z.number(),
  byOrganizations: z.array(FeedbackCountByGroupSchema),
  byVillages: z.array(FeedbackCountByGroupSchema),
  byCategories: z.array(FeedbackCountByGroupSchema),
});

export type FeedbackCountByGroup = z.infer<typeof FeedbackCountByGroupSchema>;
export type FeedbackStatisticsResponse = z.infer<
  typeof FeedbackStatisticsResponseSchema
>;
