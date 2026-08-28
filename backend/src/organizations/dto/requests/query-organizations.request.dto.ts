import { createZodDto } from 'nestjs-zod';
import { QueryOrganizationsRequestSchema } from '../../schemas/requests/query-organizations.request.schema';

export class QueryOrganizationsRequestDTO extends createZodDto(
  QueryOrganizationsRequestSchema,
) {}
