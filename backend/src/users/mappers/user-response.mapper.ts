import { User } from '../entities/user.entity';
import { UserResponse } from '../schemas';

export class UserResponseMapper {
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      villageId: user.villageId,
      village: user.village
        ? {
            id: user.village.id,
            code: user.village.code,
            name: user.village.name,
          }
        : null,
      userType: user.userType,
      organizationId: user.organizationId,
      organization: user.organization
        ? {
            id: user.organization.id,
            code: user.organization.code,
            name: user.organization.name,
            type: user.organization.type,
          }
        : null,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseList(users: User[]): UserResponse[] {
    return users.map((user) => this.toResponse(user));
  }
}
