import { createZodDto } from 'nestjs-zod';
import { UpdateFeedbackStatusRequestSchema } from '../../schemas/requests/update-feedback-status.request.schema';

export class UpdateFeedbackStatusRequestDTO extends createZodDto(
  UpdateFeedbackStatusRequestSchema,
) {}
