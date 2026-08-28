import { createZodDto } from 'nestjs-zod';
import { FeedbackStatisticsResponseSchema } from '../../schemas/responses/feedback-statistics.response.schema';

export class FeedbackStatisticsResponseDTO extends createZodDto(
  FeedbackStatisticsResponseSchema,
) {}
