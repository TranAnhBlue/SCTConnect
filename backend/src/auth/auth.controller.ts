import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator';

@ApiTags('Xác thực & Phiên đăng nhập (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản công dân mới' })
  @ApiBody({
    type: RegisterDTO,
    examples: {
      default: {
        summary: 'Mẫu đăng ký tài khoản công dân',
        value: {
          phone: '0988123456',
          fullName: 'Nguyễn Văn An',
          password: 'Password@123',
          confirmPassword: 'Password@123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký tài khoản thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Đăng ký tài khoản công dân thành công',
        data: {
          user: {
            id: 'u_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            phone: '0988123456',
            fullName: 'Nguyễn Văn An',
            userType: 'citizen',
            avatarUrl: null,
            isActive: true,
            createdAt: '2026-08-24T08:00:00.000Z',
          },
          tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            expiresIn: 900,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
    schema: {
      example: {
        statusCode: 400,
        message: 'Dữ liệu không hợp lệ',
        errors: [
          {
            field: 'phone',
            message: 'Số điện thoại không đúng định dạng Việt Nam (10 số)',
          },
          {
            field: 'confirmPassword',
            message: 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Số điện thoại đã được đăng ký',
    schema: {
      example: {
        statusCode: 409,
        message: 'Số điện thoại này đã được đăng ký trong hệ thống',
      },
    },
  })
  async register(@Body() dto: RegisterDTO) {
    const result = await this.authService.register(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đăng ký tài khoản công dân thành công',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập hệ thống (Công dân, Cán bộ, Admin)' })
  @ApiBody({
    type: LoginDTO,
    examples: {
      default: {
        summary: 'Mẫu đăng nhập',
        value: {
          phone: '0988123456',
          password: 'Password@123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Đăng nhập thành công',
        data: {
          user: {
            id: 'u_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            phone: '0988123456',
            fullName: 'Nguyễn Văn Hùng',
            userType: 'officer',
            avatarUrl: 'https://cdn.sctconnect.vn/avatars/user-01.jpg',
            isActive: true,
            lastLoginAt: '2026-08-24T08:30:00.000Z',
          },
          activeOrganization: {
            orgId: 'org_ccb_xa_uuid',
            orgCode: 'veterans_xa',
            orgName: 'Hội Cựu chiến binh Xã Thanh Oai',
            titleName: 'Chủ tịch Hội Cựu chiến binh Xã',
            roleCode: 'officer',
            isPrimary: true,
          },
          organizations: [
            {
              id: 'uo_01_uuid',
              orgId: 'org_ccb_xa_uuid',
              orgCode: 'veterans_xa',
              orgName: 'Hội Cựu chiến binh Xã Thanh Oai',
              titleName: 'Chủ tịch Hội Cựu chiến binh Xã',
              roleCode: 'officer',
              isPrimary: true,
            },
          ],
          permissions: [
            'feedback:view',
            'feedback:assign',
            'feedback:resolve',
            'reception:view',
          ],
          tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            expiresIn: 900,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Số điện thoại hoặc mật khẩu không chính xác',
    schema: {
      example: {
        statusCode: 401,
        message: 'Số điện thoại hoặc mật khẩu không chính xác',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Tài khoản đã bị tạm khóa',
    schema: {
      example: {
        statusCode: 403,
        message: 'Tài khoản của bạn đã bị tạm khóa, vui lòng liên hệ quản trị viên',
      },
    },
  })
  async login(@Body() dto: LoginDTO) {
    const result = await this.authService.login(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ tài khoản đang đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin tài khoản thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin tài khoản thành công',
        data: {
          id: 'u_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          phone: '0988123456',
          fullName: 'Nguyễn Văn Hùng',
          userType: 'officer',
          avatarUrl: 'https://cdn.sctconnect.vn/avatars/user-01.jpg',
          isActive: true,
          lastLoginAt: '2026-08-24T08:30:00.000Z',
          createdAt: '2026-08-01T00:00:00.000Z',
          activeOrganization: {
            orgId: 'org_ccb_xa_uuid',
            orgCode: 'veterans_xa',
            orgName: 'Hội Cựu chiến binh Xã Thanh Oai',
            titleName: 'Chủ tịch Hội Cựu chiến binh Xã',
            roleCode: 'officer',
            isPrimary: true,
          },
          organizations: [
            {
              id: 'uo_01_uuid',
              orgId: 'org_ccb_xa_uuid',
              orgCode: 'veterans_xa',
              orgName: 'Hội Cựu chiến binh Xã Thanh Oai',
              titleName: 'Chủ tịch Hội Cựu chiến binh Xã',
              roleCode: 'officer',
              isPrimary: true,
            },
          ],
          permissions: [
            'feedback:view',
            'feedback:assign',
            'feedback:resolve',
            'reception:view',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa đăng nhập hoặc token hết hạn',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token không hợp lệ hoặc đã hết hạn',
      },
    },
  })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.authService.getMe(user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin tài khoản thành công',
      data: result,
    };
  }
}
