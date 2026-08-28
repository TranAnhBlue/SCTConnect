import { z } from 'zod';
import { OrganizationType } from '../../entities/organization.entity';

export const QueryOrganizationsRequestSchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, 'Từ khóa tìm kiếm không được vượt quá 100 ký tự')
    .optional(),
  type: z
    .enum([
      OrganizationType.FATHERLAND_FRONT,
      OrganizationType.UNION,
      OrganizationType.OTHER,
    ])
    .optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
});

export type QueryOrganizationsRequest = z.infer<
  typeof QueryOrganizationsRequestSchema
>;
