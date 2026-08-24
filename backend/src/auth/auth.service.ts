import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { SignJWT } from 'jose';

import { User, UserType } from '../users/entities/user.entity';
import { UserOrganization } from '../organizations/entities/user-organization.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: Uint8Array;
  private readonly jwtRefreshSecret: Uint8Array;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserOrganization)
    private readonly userOrganizationsRepository: Repository<UserOrganization>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionsRepository: Repository<RolePermission>,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = new TextEncoder().encode(
      this.configService.get<string>('JWT_SECRET', 'sctconnect_jwt_secret_key_2026_super_secure_node'),
    );
    this.jwtRefreshSecret = new TextEncoder().encode(
      this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'sctconnect_jwt_refresh_secret_key_2026_super_secure_node',
      ),
    );
  }

  async register(dto: RegisterDTO) {
    const existingUser = await this.usersRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new ConflictException('Số điện thoại này đã được đăng ký trong hệ thống');
    }

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
    });

    const user = this.usersRepository.create({
      phone: dto.phone,
      fullName: dto.fullName,
      passwordHash,
      userType: UserType.CITIZEN,
      isActive: true,
    });

    const savedUser = await this.usersRepository.save(user);

    const defaultPermissions = [
      'feedback:create',
      'feedback:view_my',
      'reception:create',
      'reception:view_my',
      'poll:vote',
    ];

    const tokens = await this.generateTokens(savedUser, defaultPermissions);

    return {
      user: {
        id: savedUser.id,
        phone: savedUser.phone,
        fullName: savedUser.fullName,
        userType: savedUser.userType,
        avatarUrl: savedUser.avatarUrl,
        isActive: savedUser.isActive,
        createdAt: savedUser.createdAt,
      },
      tokens,
    };
  }

  async login(dto: LoginDTO) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.phone = :phone', { phone: dto.phone })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản của bạn đã bị tạm khóa, vui lòng liên hệ quản trị viên');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không chính xác');
    }

    await this.usersRepository.update(user.id, { lastLoginAt: new Date() });

    const userOrganizations = await this.userOrganizationsRepository.find({
      where: { userId: user.id },
      relations: { organization: true, role: true },
      order: { isPrimary: 'DESC', joinedAt: 'ASC' },
    });

    const permissions = await this.extractUserPermissions(user, userOrganizations);
    const tokens = await this.generateTokens(user, permissions);

    const activeOrg = userOrganizations.find((uo) => uo.isPrimary) || userOrganizations[0] || null;

    return {
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
      },
      activeOrganization: activeOrg
        ? {
            orgId: activeOrg.organization.id,
            orgCode: activeOrg.organization.code,
            orgName: activeOrg.organization.name,
            titleName: activeOrg.titleName,
            roleCode: activeOrg.role.code,
            isPrimary: activeOrg.isPrimary,
          }
        : null,
      organizations: userOrganizations.map((uo) => ({
        id: uo.id,
        orgId: uo.organization.id,
        orgCode: uo.organization.code,
        orgName: uo.organization.name,
        titleName: uo.titleName,
        roleCode: uo.role.code,
        isPrimary: uo.isPrimary,
      })),
      permissions,
      tokens,
    };
  }

  async getMe(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }

    const userOrganizations = await this.userOrganizationsRepository.find({
      where: { userId: user.id },
      relations: { organization: true, role: true },
      order: { isPrimary: 'DESC', joinedAt: 'ASC' },
    });

    const permissions = await this.extractUserPermissions(user, userOrganizations);
    const activeOrg = userOrganizations.find((uo) => uo.isPrimary) || userOrganizations[0] || null;

    return {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      userType: user.userType,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      activeOrganization: activeOrg
        ? {
            orgId: activeOrg.organization.id,
            orgCode: activeOrg.organization.code,
            orgName: activeOrg.organization.name,
            titleName: activeOrg.titleName,
            roleCode: activeOrg.role.code,
            isPrimary: activeOrg.isPrimary,
          }
        : null,
      organizations: userOrganizations.map((uo) => ({
        id: uo.id,
        orgId: uo.organization.id,
        orgCode: uo.organization.code,
        orgName: uo.organization.name,
        titleName: uo.titleName,
        roleCode: uo.role.code,
        isPrimary: uo.isPrimary,
      })),
      permissions,
    };
  }

  private async generateTokens(user: User, permissions: string[]) {
    const now = Math.floor(Date.now() / 1000);

    const accessToken = await new SignJWT({
      sub: user.id,
      phone: user.phone,
      userType: user.userType,
      permissions,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime('15m')
      .sign(this.jwtSecret);

    const refreshToken = await new SignJWT({
      sub: user.id,
      tokenType: 'refresh',
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime('30d')
      .sign(this.jwtRefreshSecret);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  private async extractUserPermissions(
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
