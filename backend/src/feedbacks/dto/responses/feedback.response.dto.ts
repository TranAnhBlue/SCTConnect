import { createZodDto } from 'nestjs-zod';
import {
  FeedbackResponseSchema,
  PaginatedFeedbacksResponseSchema,
} from '../../schemas/responses/feedback.response.schema';

export class FeedbackResponseDTO extends createZodDto(FeedbackResponseSchema) {}

export class PaginatedFeedbacksResponseDTO extends createZodDto(
  PaginatedFeedbacksResponseSchema,
) {}
