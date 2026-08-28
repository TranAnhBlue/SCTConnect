import { z } from 'zod';

export const PaginationMetaSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
