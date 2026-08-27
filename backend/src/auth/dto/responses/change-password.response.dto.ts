import { createZodDto } from 'nestjs-zod';
import { ChangePasswordResponseSchema } from '../../schemas/responses/change-password.response.schema';

export class ChangePasswordResponseDTO extends createZodDto(
  ChangePasswordResponseSchema,
) {}
