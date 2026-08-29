import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersAdminService } from './services/users-admin.service';
import { UserType } from './entities/user.entity';
import {
  QueryUsersRequestDTO,
  UpdateUserStatusRequestDTO,
  UpdateUserRoleRequestDTO,
  UserResponseDTO,
  PaginatedUsersResponseDTO,
} from './dto';
import {
  UserResponse,
  PaginatedUsersResponse,
  UserResponseSchema,
  PaginatedUsersResponseSchema,
} from './schemas';
import { CurrentUser, ApiSuccessResponse, Roles } from '../common/decorators';
import type { AuthenticatedUser } from '../common/decorators';

@ApiTags('Quản lý Người dùng Cấp Xã (Admin - Users)')
@ApiBearerAuth()
@Roles(UserType.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách người dùng toàn xã (Chỉ dành riêng cho Admin)',
  })
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

  @Get(':id')
  @ApiOperation({
    summary: 'Xem chi tiết hồ sơ người dùng theo ID (Chỉ dành riêng cho Admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID của người dùng' })
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

  @Patch(':id/status')
  @ApiOperation({
    summary:
      'Khóa hoặc mở khóa tài khoản người dùng (Chỉ dành riêng cho Admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID của người dùng' })
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
    return this.usersAdminService.updateStatus(id, dto, currentUser.id);
  }

  @Patch(':id/role')
  @ApiOperation({
    summary:
      'Gán vai trò Cán bộ / Phân quyền và chỉ định Hội tiếp nhận (Chỉ dành riêng cho Admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID của người dùng' })
  @ApiSuccessResponse(
    UserResponseDTO,
    UserResponseSchema,
    'Cập nhật vai trò người dùng thành công',
  )
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserRoleRequestDTO,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponse> {
    return this.usersAdminService.updateRole(id, dto, currentUser.id);
  }
}
