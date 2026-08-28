import { createZodDto } from 'nestjs-zod';
import { QueryFeedbacksRequestSchema } from '../../schemas/requests/query-feedbacks.request.schema';

export class QueryFeedbacksRequestDTO extends createZodDto(
  QueryFeedbacksRequestSchema,
) {}
