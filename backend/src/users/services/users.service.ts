import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from '../entities/user.entity';
import { Village } from '../../villages/entities/village.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { UserResponse } from '../schemas';
import { UserResponseMapper } from '../mappers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Village)
    private readonly villagesRepository: Repository<Village>,
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {}

  async createCitizen(
    phone: string,
    fullName: string,
    villageId: string,
    passwordHash: string,
    organizationId?: string | null,
  ): Promise<User> {
    const village = await this.villagesRepository.findOne({
      where: { id: villageId, isActive: true },
    });

    if (!village) {
      throw new BadRequestException(
        'Thôn / Tổ dân phố không tồn tại hoặc đã ngừng hoạt động',
      );
    }

    if (organizationId) {
      const org = await this.organizationsRepository.findOne({
        where: { id: organizationId, isActive: true },
      });

      if (!org) {
        throw new BadRequestException(
          'Tổ chức / Hội đoàn thể không tồn tại hoặc đã ngừng hoạt động',
        );
      }
    }

    const user = this.usersRepository.create({
      phone,
      fullName,
      villageId,
      passwordHash,
      organizationId: organizationId || null,
      userType: UserType.CITIZEN,
      isActive: true,
    });

    return this.usersRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { phone },
      relations: { organization: true, village: true },
    });
  }

  async findForLogin(phone: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.village', 'village')
      .addSelect('user.passwordHash')
      .where('user.phone = :phone', { phone })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { organization: true, village: true },
    });
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.village', 'village')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id })
      .getOne();
  }

  validateActive(user: { isActive: boolean }): void {
    if (!user.isActive) {
      throw new ForbiddenException(
        'Tài khoản của bạn đã bị tạm khóa, vui lòng liên hệ quản trị viên',
      );
    }
  }

  async updateLastLogin(
    userId: string,
    lastLoginAt: Date = new Date(),
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt,
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordHash,
    });
  }

  async updateProfile(
    userId: string,
    dto: {
      fullName?: string;
      villageId?: string;
      organizationId?: string | null;
    },
  ): Promise<UserResponse> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }

    this.validateActive(user);

    const updateData: Partial<User> = {};

    if (dto.fullName !== undefined) {
      updateData.fullName = dto.fullName;
    }

    if (dto.villageId !== undefined) {
      const village = await this.villagesRepository.findOne({
        where: { id: dto.villageId, isActive: true },
      });

      if (!village) {
        throw new BadRequestException(
          'Thôn / Tổ dân phố không tồn tại hoặc đã ngừng hoạt động',
        );
      }

      updateData.villageId = dto.villageId;
    }

    if (dto.organizationId !== undefined) {
      if (dto.organizationId !== null) {
        const org = await this.organizationsRepository.findOne({
          where: { id: dto.organizationId, isActive: true },
        });

        if (!org) {
          throw new BadRequestException(
            'Tổ chức / Hội đoàn thể không tồn tại hoặc đã ngừng hoạt động',
          );
        }
      }

      updateData.organizationId = dto.organizationId;
    }

    if (Object.keys(updateData).length > 0) {
      await this.usersRepository.update(userId, updateData);
    }

    const updatedUser = await this.findById(userId);

    return UserResponseMapper.toResponse(updatedUser!);
  }
}
