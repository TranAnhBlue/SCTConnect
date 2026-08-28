import { createZodDto } from 'nestjs-zod';
import { CreateOrganizationRequestSchema } from '../../schemas/requests/create-organization.request.schema';

export class CreateOrganizationRequestDTO extends createZodDto(
  CreateOrganizationRequestSchema,
) {}
