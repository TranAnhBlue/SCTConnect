import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { QueryUsersRequestDTO, UpdateUserStatusRequestDTO } from '../dto';
import { UserResponse, PaginatedUsersResponse } from '../schemas';

@Injectable()
export class UsersAdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async updateStatus(
    targetUserId: string,
    dto: UpdateUserStatusRequestDTO,
    currentUserId: string,
  ): Promise<UserResponse> {
    if (targetUserId === currentUserId) {
      throw new BadRequestException(
        'Bạn không thể tự khóa hoặc thay đổi trạng thái tài khoản của chính mình',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng này trong hệ thống');
    }

    user.isActive = dto.isActive;
    const savedUser = await this.usersRepository.save(user);

    return {
      id: savedUser.id,
      phone: savedUser.phone,
      fullName: savedUser.fullName,
      userType: savedUser.userType,
      avatarUrl: savedUser.avatarUrl,
      isActive: savedUser.isActive,
      lastLoginAt: savedUser.lastLoginAt,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }

  async findAll(
    query: QueryUsersRequestDTO,
  ): Promise<PaginatedUsersResponse> {
    const { page = 1, limit = 20, search, userType, isActive } = query;

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userOrganizations',
        'uo',
        'uo.isPrimary = :isPrimary',
        { isPrimary: true },
      )
      .leftJoinAndSelect('uo.organization', 'org')
      .leftJoinAndSelect('uo.role', 'role')
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(user.phone ILIKE :search OR user.fullName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (userType) {
      qb.andWhere('user.userType = :userType', { userType });
    }

    if (isActive !== undefined) {
      qb.andWhere('user.isActive = :isActive', { isActive });
    }

    const [users, totalItems] = await qb.getManyAndCount();

    const items = users.map((user) => {
      const primaryUO = user.userOrganizations?.[0] || null;

      return {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        primaryOrganization: primaryUO?.organization
          ? {
              orgId: primaryUO.organization.id,
              orgCode: primaryUO.organization.code,
              orgName: primaryUO.organization.name,
              titleName: primaryUO.titleName,
              roleCode: primaryUO.role?.code,
            }
          : null,
      };
    });

    return {
      items,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userOrganizations', 'uo')
      .leftJoinAndSelect('uo.organization', 'org')
      .leftJoinAndSelect('uo.role', 'role')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(
        'Không tìm thấy người dùng này trong hệ thống',
      );
    }

    const primaryUO =
      user.userOrganizations?.find((uo) => uo.isPrimary) || null;

    return {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      userType: user.userType,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      primaryOrganization: primaryUO?.organization
        ? {
            orgId: primaryUO.organization.id,
            orgCode: primaryUO.organization.code,
            orgName: primaryUO.organization.name,
            titleName: primaryUO.titleName,
            roleCode: primaryUO.role?.code,
          }
        : null,
      organizations:
        user.userOrganizations?.map((uo) => ({
          id: uo.id,
          orgId: uo.organization?.id,
          orgCode: uo.organization?.code,
          orgName: uo.organization?.name,
          titleName: uo.titleName,
          roleCode: uo.role?.code,
          isPrimary: uo.isPrimary,
          joinedAt: uo.joinedAt,
        })) || [],
    };
  }
}
