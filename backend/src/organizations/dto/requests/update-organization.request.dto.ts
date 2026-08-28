import { createZodDto } from 'nestjs-zod';
import { UpdateOrganizationRequestSchema } from '../../schemas/requests/update-organization.request.schema';

export class UpdateOrganizationRequestDTO extends createZodDto(
  UpdateOrganizationRequestSchema,
) {}
