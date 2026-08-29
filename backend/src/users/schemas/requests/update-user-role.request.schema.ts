import { z } from 'zod';
import { UserType } from '../../entities/user.entity';

export const UpdateUserRoleRequestSchema = z
  .object({
    userType: z.enum([UserType.CITIZEN, UserType.OFFICER, UserType.ADMIN], {
      message: 'Loại tài khoản phải là citizen, officer hoặc admin',
    }),
    organizationId: z
      .string()
      .uuid({ message: 'organizationId phải là UUID hợp lệ' })
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.userType === UserType.OFFICER && !data.organizationId) {
        return false;
      }
      return true;
    },
    {
      message:
        'Khi gán vai trò Cán bộ (officer), bắt buộc phải chỉ định Hội / Tổ chức tiếp nhận (organizationId)',
      path: ['organizationId'],
    },
  );

export type UpdateUserRoleRequest = z.infer<
  typeof UpdateUserRoleRequestSchema
>;
