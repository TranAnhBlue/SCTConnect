import { createZodDto } from 'nestjs-zod';
import { RespondFeedbackRequestSchema } from '../../schemas/requests/respond-feedback.request.schema';

export class RespondFeedbackRequestDTO extends createZodDto(
  RespondFeedbackRequestSchema,
) {}
