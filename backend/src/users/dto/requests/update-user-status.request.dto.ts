import { createZodDto } from 'nestjs-zod';
import { UpdateUserStatusRequestSchema } from '../../schemas/requests/update-user-status.request.schema';

export class UpdateUserStatusRequestDTO extends createZodDto(
  UpdateUserStatusRequestSchema,
) {}
