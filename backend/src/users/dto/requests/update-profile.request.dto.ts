import { createZodDto } from 'nestjs-zod';
import { UpdateProfileRequestSchema } from '../../schemas/requests/update-profile.request.schema';

export class UpdateProfileRequestDTO extends createZodDto(
  UpdateProfileRequestSchema,
) {}
