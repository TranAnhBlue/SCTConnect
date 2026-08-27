import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { User, UserType } from '../../users/entities/user.entity';
import { UserOrganization } from '../../organizations/entities/user-organization.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionsRepository: Repository<RolePermission>,
  ) {}

  async getUserPermissions(
    user: User,
    userOrganizations: UserOrganization[],
  ): Promise<string[]> {
    if (user.userType === UserType.CITIZEN) {
      return [
        'feedback:create',
        'feedback:view_my',
        'reception:create',
        'reception:view_my',
        'poll:vote',
      ];
    }

    if (user.userType === UserType.ADMIN) {
      return ['*'];
    }

    const roleIds = userOrganizations.map((uo) => uo.roleId).filter(Boolean);
    if (roleIds.length === 0) {
      return [];
    }

    const rolePermissions = await this.rolePermissionsRepository
      .createQueryBuilder('rp')
      .leftJoinAndSelect('rp.permission', 'perm')
      .where('rp.roleId IN (:...roleIds)', { roleIds })
      .getMany();

    const permSet = new Set<string>();
    for (const rp of rolePermissions) {
      if (rp.permission?.code) {
        permSet.add(rp.permission.code);
      }
    }

    return Array.from(permSet);
  }
}
