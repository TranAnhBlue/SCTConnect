import { createZodDto } from 'nestjs-zod';
import { QueryCategoriesRequestSchema } from '../../schemas/requests/query-categories.request.schema';

export class QueryCategoriesRequestDTO extends createZodDto(
  QueryCategoriesRequestSchema,
) {}
