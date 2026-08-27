import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersAdminService } from './services/users-admin.service';
import { UsersService } from './services/users.service';
import {
  QueryUsersRequestDTO,
  UpdateUserStatusRequestDTO,
  UpdateProfileRequestDTO,
  UserResponseDTO,
  PaginatedUsersResponseDTO,
} from './dto';
import {
  UserResponse,
  PaginatedUsersResponse,
  UserResponseSchema,
  PaginatedUsersResponseSchema,
} from './schemas';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, ApiSuccessResponse } from '../common/decorators';
import type { AuthenticatedUser } from '../common/decorators';

@ApiTags('Quản lý Người dùng & Hồ sơ (Users)')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersAdminService: UsersAdminService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách người dùng toàn xã (Admin / Quản trị)' })
  @ApiSuccessResponse(
    PaginatedUsersResponseDTO,
    PaginatedUsersResponseSchema,
    'Lấy danh sách người dùng thành công',
  )
  async findAll(
    @Query() query: QueryUsersRequestDTO,
  ): Promise<PaginatedUsersResponse> {
    return this.usersAdminService.findAll(query);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin hồ sơ cá nhân' })
  @ApiSuccessResponse(
    UserResponseDTO,
    UserResponseSchema,
    'Cập nhật thông tin hồ sơ thành công',
  )
  async updateMe(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileRequestDTO,
  ): Promise<UserResponse> {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khóa hoặc mở khóa tài khoản người dùng (Admin / Quản trị)' })
  @ApiSuccessResponse(
    UserResponseDTO,
    UserResponseSchema,
    'Cập nhật trạng thái người dùng thành công',
  )
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusRequestDTO,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponse> {
    return this.usersAdminService.updateStatus(
      id,
      dto,
      currentUser.id,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xem chi tiết hồ sơ người dùng theo ID' })
  @ApiSuccessResponse(
    UserResponseDTO,
    UserResponseSchema,
    'Lấy thông tin người dùng thành công',
  )
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponse> {
    return this.usersAdminService.findOne(id);
  }
}
