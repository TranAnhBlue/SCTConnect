import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { UsersService } from '../../users/services/users.service';
import { UserResponseMapper } from '../../users/mappers';
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  ChangePasswordRequestDTO,
  RefreshTokenRequestDTO,
} from '../dto';
import { UpdateProfileRequestDTO } from '../../users/dto';
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
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterRequestDTO): Promise<RegisterResponse> {
    const existing = await this.usersService.findByPhone(dto.phone);
    if (existing) {
      throw new ConflictException(
        'Số điện thoại này đã được đăng ký tài khoản trên hệ thống',
      );
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const savedUser = await this.usersService.createCitizen(
      dto.phone,
      dto.fullName,
      dto.villageId,
      passwordHash,
      dto.organizationId,
    );

    const tokens = await this.tokenService.generateTokens({
      id: savedUser.id,
      phone: savedUser.phone,
      userType: savedUser.userType,
      organizationId: savedUser.organizationId,
    });

    return {
      user: UserResponseMapper.toResponse(savedUser),
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
      dto.password,
      user.passwordHash,
      'Số điện thoại hoặc mật khẩu không chính xác',
    );

    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.tokenService.generateTokens({
      id: user.id,
      phone: user.phone,
      userType: user.userType,
      organizationId: user.organizationId,
      organizationCode: user.organization?.code,
    });

    return {
      user: UserResponseMapper.toResponse(user),
      tokens,
    };
  }

  async getMe(userId: string): Promise<UserProfileResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    this.usersService.validateActive(user);

    return UserResponseMapper.toResponse(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileRequestDTO,
  ): Promise<UserProfileResponse> {
    await this.usersService.updateProfile(userId, dto);
    return this.getMe(userId);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordRequestDTO,
  ): Promise<ChangePasswordResponse> {
    const user = await this.usersService.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    this.usersService.validateActive(user);

    await this.passwordService.verifyOrThrow(
      dto.oldPassword,
      user.passwordHash,
      'Mật khẩu hiện tại không chính xác',
    );

    const isSamePassword = await this.passwordService.verify(
      dto.newPassword,
      user.passwordHash,
    );
    if (isSamePassword) {
      throw new UnauthorizedException(
        'Mật khẩu mới không được trùng với mật khẩu hiện tại',
      );
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

    const tokens = await this.tokenService.generateTokens({
      id: user.id,
      phone: user.phone,
      userType: user.userType,
      organizationId: user.organizationId,
      organizationCode: user.organization?.code,
    });

    return tokens;
  }
}
