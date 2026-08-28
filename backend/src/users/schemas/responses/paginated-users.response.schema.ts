import { z } from 'zod';
import { UserResponseSchema } from './user.response.schema';
import { PaginationMetaSchema } from '../../../common/schemas';

export const PaginatedUsersResponseSchema = z.object({
  items: z.array(UserResponseSchema),
  pagination: PaginationMetaSchema,
});

export type PaginatedUsersResponse = z.infer<
  typeof PaginatedUsersResponseSchema
>;
