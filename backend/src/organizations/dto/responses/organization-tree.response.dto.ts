import { createZodDto } from 'nestjs-zod';
import { OrganizationTreeResponseSchema } from '../../schemas/responses/organization-tree.response.schema';

export class OrganizationTreeResponseDTO extends createZodDto(
  OrganizationTreeResponseSchema,
) {}
