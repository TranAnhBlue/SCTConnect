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
import { UserResponseMapper } from '../mappers';

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
      relations: { organization: true, village: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Không tìm thấy người dùng này trong hệ thống',
      );
    }

    user.isActive = dto.isActive;
    const savedUser = await this.usersRepository.save(user);

    return UserResponseMapper.toResponse(savedUser);
  }

  async findAll(
    query: QueryUsersRequestDTO,
  ): Promise<PaginatedUsersResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      villageId,
      organizationId,
      userType,
      isActive,
    } = query;

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'org')
      .leftJoinAndSelect('user.village', 'village')
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(user.phone ILIKE :search OR user.fullName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (villageId) {
      qb.andWhere('user.villageId = :villageId', { villageId });
    }

    if (organizationId) {
      qb.andWhere('user.organizationId = :organizationId', { organizationId });
    }

    if (userType) {
      qb.andWhere('user.userType = :userType', { userType });
    }

    if (isActive !== undefined) {
      qb.andWhere('user.isActive = :isActive', { isActive });
    }

    const [users, totalItems] = await qb.getManyAndCount();

    return {
      items: UserResponseMapper.toResponseList(users),
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { organization: true, village: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Không tìm thấy người dùng này trong hệ thống',
      );
    }

    return UserResponseMapper.toResponse(user);
  }
}
