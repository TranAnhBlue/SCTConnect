import { z } from 'zod';
import { UserResponseSchema } from './user.response.schema';

export const PaginatedUsersResponseSchema = z.object({
  items: z.array(UserResponseSchema),
  pagination: z.object({
    currentPage: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  }),
});

export type PaginatedUsersResponse = z.infer<
  typeof PaginatedUsersResponseSchema
>;
