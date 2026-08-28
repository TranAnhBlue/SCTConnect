import { createZodDto } from 'nestjs-zod';
import { QueryFeedbackStatisticsRequestSchema } from '../../schemas/requests/query-feedback-statistics.request.schema';

export class QueryFeedbackStatisticsRequestDTO extends createZodDto(
  QueryFeedbackStatisticsRequestSchema,
) {}
