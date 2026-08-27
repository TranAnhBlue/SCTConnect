import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, ApiSuccessResponse } from '../common/decorators';

@ApiTags('Xác thực & Phiên đăng nhập (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @UseGuards(JwtAuthGuard)
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

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
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
