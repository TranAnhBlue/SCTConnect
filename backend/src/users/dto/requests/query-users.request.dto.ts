import { createZodDto } from 'nestjs-zod';
import { QueryUsersRequestSchema } from '../../schemas/requests/query-users.request.schema';

export class QueryUsersRequestDTO extends createZodDto(
  QueryUsersRequestSchema,
) {}
