import { z } from 'zod';
import { OrganizationType } from '../../entities/organization.entity';

export const CreateOrganizationRequestSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Mã tổ chức phải có ít nhất 2 ký tự')
    .max(50, 'Mã tổ chức tối đa 50 ký tự')
    .toUpperCase(),
  name: z
    .string()
    .trim()
    .min(2, 'Tên tổ chức phải có ít nhất 2 ký tự')
    .max(255, 'Tên tổ chức tối đa 255 ký tự'),
  type: z
    .enum([
      OrganizationType.FATHERLAND_FRONT,
      OrganizationType.UNION,
      OrganizationType.OTHER,
    ])
    .default(OrganizationType.UNION),
});

export type CreateOrganizationRequest = z.infer<
  typeof CreateOrganizationRequestSchema
>;
