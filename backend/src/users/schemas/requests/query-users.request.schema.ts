import { z } from 'zod';
import { UserType } from '../../entities/user.entity';

export const QueryUsersRequestSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  villageId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  userType: z
    .enum([UserType.CITIZEN, UserType.OFFICER, UserType.ADMIN])
    .optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
});

export type QueryUsersRequest = z.infer<typeof QueryUsersRequestSchema>;
