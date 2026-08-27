import { createZodDto } from 'nestjs-zod';
import { ChangePasswordRequestSchema } from '../../schemas/requests/change-password.request.schema';

export class ChangePasswordRequestDTO extends createZodDto(
  ChangePasswordRequestSchema,
) {}
