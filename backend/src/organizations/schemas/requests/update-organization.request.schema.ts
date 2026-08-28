import { z } from 'zod';
import { OrganizationType } from '../../entities/organization.entity';

export const UpdateOrganizationRequestSchema = z.object({
  name: z.string().trim().min(2).max(255).optional(),
  type: z
    .enum([
      OrganizationType.FATHERLAND_FRONT,
      OrganizationType.UNION,
      OrganizationType.OTHER,
    ])
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateOrganizationRequest = z.infer<
  typeof UpdateOrganizationRequestSchema
>;
