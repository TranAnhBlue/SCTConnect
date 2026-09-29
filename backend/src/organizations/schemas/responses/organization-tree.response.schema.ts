import { z } from 'zod';
import { IsoDateSchema, IsoDate } from '../../../common/schemas';

export interface OrganizationTreeNode {
  id: string;
  code: string;
  name: string;
  type: string;
  isActive: boolean;
  parentOrganizationId: string | null;
  createdAt: IsoDate;
  updatedAt?: IsoDate;
  children: OrganizationTreeNode[];
}

export const OrganizationTreeNodeResponseSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    type: z.string(),
    isActive: z.boolean(),
    parentOrganizationId: z.string().uuid().nullable().optional(),
    createdAt: IsoDateSchema,
    updatedAt: IsoDateSchema.optional(),
    children: z.array(OrganizationTreeNodeResponseSchema).default([]),
  }),
);

export const OrganizationTreeResponseSchema = z.array(
  OrganizationTreeNodeResponseSchema,
);

export type OrganizationTreeResponse = OrganizationTreeNode[];
