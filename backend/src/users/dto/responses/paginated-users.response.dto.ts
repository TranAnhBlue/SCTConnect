import { createZodDto } from 'nestjs-zod';
import { PaginatedUsersResponseSchema } from '../../schemas/responses/paginated-users.response.schema';

export class PaginatedUsersResponseDTO extends createZodDto(
  PaginatedUsersResponseSchema,
) {}
