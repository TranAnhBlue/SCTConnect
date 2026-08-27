import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from '../entities/user.entity';
import { UserResponse } from '../schemas';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createCitizen(
    phone: string,
    fullName: string,
    passwordHash: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      phone,
      fullName,
      passwordHash,
      userType: UserType.CITIZEN,
      isActive: true,
    });

    return this.usersRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { phone },
    });
  }

  async findForLogin(phone: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.phone = :phone', { phone })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
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
    dto: { fullName?: string; avatarUrl?: string | null },
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

    if (dto.avatarUrl !== undefined) {
      updateData.avatarUrl = dto.avatarUrl;
    }

    if (Object.keys(updateData).length > 0) {
      await this.usersRepository.update(userId, updateData);
    }

    const updatedUser = await this.findById(userId);

    return {
      id: updatedUser!.id,
      phone: updatedUser!.phone,
      fullName: updatedUser!.fullName,
      userType: updatedUser!.userType,
      avatarUrl: updatedUser!.avatarUrl,
      isActive: updatedUser!.isActive,
      lastLoginAt: updatedUser!.lastLoginAt,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
    };
  }
}
