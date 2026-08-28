import { z } from 'zod';
import { IsoDateSchema, PaginationMetaSchema } from '../../../common/schemas';

export const FeedbackAttachmentResponseSchema = z.object({
  id: z.string().uuid(),
  fileUrl: z.string(),
  fileType: z.string(),
  createdAt: IsoDateSchema,
});

export const FeedbackUserSummarySchema = z
  .object({
    id: z.string().uuid(),
    fullName: z.string(),
    phone: z.string(),
  })
  .nullable();

export const FeedbackOrganizationSummarySchema = z
  .object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    type: z.string().optional(),
  })
  .nullable();

export const FeedbackVillageSummarySchema = z
  .object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
  })
  .nullable();

export const FeedbackCategorySummarySchema = z
  .object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
  })
  .nullable();

export const FeedbackResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  userId: z.string().uuid(),
  user: FeedbackUserSummarySchema.optional(),
  targetOrganizationId: z.string().uuid(),
  targetOrganization: FeedbackOrganizationSummarySchema.optional(),
  incidentVillageId: z.string().uuid(),
  incidentVillage: FeedbackVillageSummarySchema.optional(),
  categoryId: z.string().uuid(),
  category: FeedbackCategorySummarySchema.optional(),
  address: z.string().nullable().optional(),
  title: z.string(),
  content: z.string(),
  status: z.string(),
  attachments: z.array(FeedbackAttachmentResponseSchema).default([]),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema.optional(),
});

export const PaginatedFeedbacksResponseSchema = z.object({
  items: z.array(FeedbackResponseSchema),
  pagination: PaginationMetaSchema,
});

export type FeedbackAttachmentResponse = z.infer<
  typeof FeedbackAttachmentResponseSchema
>;
export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;
export type PaginatedFeedbacksResponse = z.infer<
  typeof PaginatedFeedbacksResponseSchema
>;
