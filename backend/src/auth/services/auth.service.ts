import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from '../../users/services/users.service';
import { OrganizationsService } from '../../organizations/services/organizations.service';
import { RolesService } from '../../roles/services/roles.service';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  ChangePasswordRequestDTO,
  RefreshTokenRequestDTO,
} from '../dto';
import {
  RegisterResponse,
  LoginResponse,
  UserProfileResponse,
  ChangePasswordResponse,
  AuthTokensResponse,
} from '../schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
    private readonly rolesService: RolesService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterRequestDTO): Promise<RegisterResponse> {
    const existingUser = await this.usersService.findByPhone(dto.phone);
    if (existingUser) {
      throw new ConflictException(
        'Số điện thoại này đã được đăng ký trong hệ thống',
      );
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const savedUser = await this.usersService.createCitizen(
      dto.phone,
      dto.fullName,
      passwordHash,
    );

    const permissions = await this.rolesService.getUserPermissions(
      savedUser,
      [],
    );
    const tokens = await this.tokenService.generateTokens(
      {
        id: savedUser.id,
        phone: savedUser.phone,
        userType: savedUser.userType,
      },
      permissions,
    );

    return {
      user: {
        id: savedUser.id,
        phone: savedUser.phone,
        fullName: savedUser.fullName,
        userType: savedUser.userType,
        avatarUrl: savedUser.avatarUrl,
        isActive: savedUser.isActive,
        lastLoginAt: savedUser.lastLoginAt,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      tokens,
    };
  }

  async login(dto: LoginRequestDTO): Promise<LoginResponse> {
    const user = await this.usersService.findForLogin(dto.phone);
    if (!user) {
      throw new UnauthorizedException(
        'Số điện thoại hoặc mật khẩu không chính xác',
      );
    }

    this.usersService.validateActive(user);

    await this.passwordService.verifyOrThrow(
      user.passwordHash,
      dto.password,
      'Số điện thoại hoặc mật khẩu không chính xác',
    );

    const lastLoginAt = new Date();
    await this.usersService.updateLastLogin(user.id, lastLoginAt);

    const userOrganizations =
      await this.organizationsService.findUserOrganizations(user.id);
    const activeUO =
      userOrganizations.find((uo) => uo.isPrimary) ||
      userOrganizations[0] ||
      null;

    const permissions = await this.rolesService.getUserPermissions(
      user,
      userOrganizations,
    );
    const tokens = await this.tokenService.generateTokens(
      {
        id: user.id,
        phone: user.phone,
        userType: user.userType,
      },
      permissions,
    );

    return {
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      activeOrganization: activeUO?.organization
        ? {
            orgId: activeUO.organization.id,
            orgCode: activeUO.organization.code,
            orgName: activeUO.organization.name,
            titleName: activeUO.titleName,
            roleCode: activeUO.role?.code,
          }
        : null,
      organizations: userOrganizations.map((uo) => ({
        id: uo.id,
        orgId: uo.organization?.id,
        orgCode: uo.organization?.code,
        orgName: uo.organization?.name,
        titleName: uo.titleName,
        roleCode: uo.role?.code,
        isPrimary: uo.isPrimary,
        joinedAt: uo.joinedAt,
      })),
      permissions,
      tokens,
    };
  }

  async getMe(userId: string): Promise<UserProfileResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }

    this.usersService.validateActive(user);

    const userOrganizations =
      await this.organizationsService.findUserOrganizations(user.id);
    const activeUO =
      userOrganizations.find((uo) => uo.isPrimary) ||
      userOrganizations[0] ||
      null;
    const permissions = await this.rolesService.getUserPermissions(
      user,
      userOrganizations,
    );

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
      activeOrganization: activeUO?.organization
        ? {
            orgId: activeUO.organization.id,
            orgCode: activeUO.organization.code,
            orgName: activeUO.organization.name,
            titleName: activeUO.titleName,
            roleCode: activeUO.role?.code,
          }
        : null,
      organizations: userOrganizations.map((uo) => ({
        id: uo.id,
        orgId: uo.organization?.id,
        orgCode: uo.organization?.code,
        orgName: uo.organization?.name,
        titleName: uo.titleName,
        roleCode: uo.role?.code,
        isPrimary: uo.isPrimary,
        joinedAt: uo.joinedAt,
      })),
      permissions,
    };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordRequestDTO,
  ): Promise<ChangePasswordResponse> {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản');
    }

    this.usersService.validateActive(user);

    const isOldPasswordValid = await this.passwordService.verify(
      user.passwordHash,
      dto.oldPassword,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    const newPasswordHash = await this.passwordService.hash(dto.newPassword);
    await this.usersService.updatePassword(userId, newPasswordHash);

    return {
      success: true,
      message: 'Đổi mật khẩu thành công',
    };
  }

  async refreshToken(
    dto: RefreshTokenRequestDTO,
  ): Promise<AuthTokensResponse> {
    const payload = await this.tokenService.verifyRefreshToken(
      dto.refreshToken,
    );
    if (payload.tokenType !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException(
        'Token không đúng định dạng refresh token',
      );
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại trong hệ thống',
      );
    }

    this.usersService.validateActive(user);

    const userOrganizations =
      await this.organizationsService.findUserOrganizations(user.id);
    const permissions = await this.rolesService.getUserPermissions(
      user,
      userOrganizations,
    );

    const tokens = await this.tokenService.generateTokens(
      {
        id: user.id,
        phone: user.phone,
        userType: user.userType,
      },
      permissions,
    );

    return tokens;
  }
}
