import { createZodDto } from 'nestjs-zod';
import { QueryVillagesRequestSchema } from '../../schemas/requests/query-villages.request.schema';

export class QueryVillagesRequestDTO extends createZodDto(
  QueryVillagesRequestSchema,
) {}
