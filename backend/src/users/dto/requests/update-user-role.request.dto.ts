import { createZodDto } from 'nestjs-zod';
import { UpdateUserRoleRequestSchema } from '../../schemas/requests/update-user-role.request.schema';

export class UpdateUserRoleRequestDTO extends createZodDto(
  UpdateUserRoleRequestSchema,
) {}
