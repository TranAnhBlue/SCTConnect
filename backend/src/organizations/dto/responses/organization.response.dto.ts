import { createZodDto } from 'nestjs-zod';
import {
  OrganizationResponseSchema,
  OrganizationListResponseSchema,
} from '../../schemas/responses/organization.response.schema';

export class OrganizationResponseDTO extends createZodDto(
  OrganizationResponseSchema,
) {}

export class OrganizationListResponseDTO extends createZodDto(
  OrganizationListResponseSchema,
) {}
