import { createZodDto } from 'nestjs-zod';
import { CreateFeedbackRequestSchema } from '../../schemas/requests/create-feedback.request.schema';

export class CreateFeedbackRequestDTO extends createZodDto(
  CreateFeedbackRequestSchema,
) {}
