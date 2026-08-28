import { z } from 'zod';

export const QueryFeedbackStatisticsRequestSchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  targetOrganizationId: z.string().uuid().optional(),
  incidentVillageId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});

export type QueryFeedbackStatisticsRequest = z.infer<
  typeof QueryFeedbackStatisticsRequestSchema
>;
