import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  ChangePasswordRequestDTO,
  RefreshTokenRequestDTO,
  RegisterResponseDTO,
  LoginResponseDTO,
  UserProfileResponseDTO,
  ChangePasswordResponseDTO,
  AuthTokensResponseDTO,
} from './dto';
import { UpdateProfileRequestDTO } from '../users/dto';
import {
  RegisterResponse,
  LoginResponse,
  UserProfileResponse,
  ChangePasswordResponse,
  AuthTokensResponse,
  RegisterResponseSchema,
  LoginResponseSchema,
  UserProfileResponseSchema,
  ChangePasswordResponseSchema,
  AuthTokensResponseSchema,
} from './schemas';
import { CurrentUser, ApiSuccessResponse, Public } from '../common/decorators';

@ApiTags('Xác thực & Hồ sơ cá nhân (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản công dân mới' })
  @ApiSuccessResponse(
    RegisterResponseDTO,
    RegisterResponseSchema,
    'Đăng ký tài khoản công dân thành công',
    201,
  )
  async register(
    @Body() dto: RegisterRequestDTO,
  ): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập hệ thống (Công dân, Cán bộ, Admin)' })
  @ApiSuccessResponse(
    LoginResponseDTO,
    LoginResponseSchema,
    'Đăng nhập thành công',
  )
  async login(@Body() dto: LoginRequestDTO): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Làm mới phiên đăng nhập (Cấp Access Token mới)' })
  @ApiSuccessResponse(
    AuthTokensResponseDTO,
    AuthTokensResponseSchema,
    'Làm mới phiên đăng nhập thành công',
  )
  async refreshToken(
    @Body() dto: RefreshTokenRequestDTO,
  ): Promise<AuthTokensResponse> {
    return this.authService.refreshToken(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ tài khoản đang đăng nhập' })
  @ApiSuccessResponse(
    UserProfileResponseDTO,
    UserProfileResponseSchema,
    'Lấy thông tin tài khoản thành công',
  )
  async getMe(
    @CurrentUser('id') userId: string,
  ): Promise<UserProfileResponse> {
    return this.authService.getMe(userId);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ cá nhân' })
  @ApiSuccessResponse(
    UserProfileResponseDTO,
    UserProfileResponseSchema,
    'Cập nhật thông tin hồ sơ thành công',
  )
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileRequestDTO,
  ): Promise<UserProfileResponse> {
    return this.authService.updateProfile(userId, dto);
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản cá nhân' })
  @ApiSuccessResponse(
    ChangePasswordResponseDTO,
    ChangePasswordResponseSchema,
    'Đổi mật khẩu thành công',
  )
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordRequestDTO,
  ): Promise<ChangePasswordResponse> {
    return this.authService.changePassword(userId, dto);
  }
}
