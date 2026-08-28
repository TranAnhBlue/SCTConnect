import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrganizationsService } from './services/organizations.service';
import {
  QueryOrganizationsRequestDTO,
  CreateOrganizationRequestDTO,
  UpdateOrganizationRequestDTO,
  OrganizationResponseDTO,
  OrganizationListResponseDTO,
  OrganizationTreeResponseDTO,
} from './dto';
import {
  OrganizationResponse,
  OrganizationListResponse,
  OrganizationTreeResponse,
  OrganizationResponseSchema,
  OrganizationListResponseSchema,
  OrganizationTreeResponseSchema,
} from './schemas';
import { UserType } from '../users/entities/user.entity';
import { ApiSuccessResponse, Public, Roles } from '../common/decorators';

@ApiTags('Cơ cấu Tổ chức & Hội đoàn thể (Organizations)')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách phẳng các tổ chức, hội đoàn thể toàn xã',
  })
  @ApiSuccessResponse(
    OrganizationListResponseDTO,
    OrganizationListResponseSchema,
    'Lấy danh sách tổ chức thành công',
  )
  async findAll(
    @Query() query: QueryOrganizationsRequestDTO,
  ): Promise<OrganizationListResponse> {
    return this.organizationsService.findAll(query);
  }

  @Public()
  @Get('tree')
  @ApiOperation({
    summary: 'Lấy sơ đồ cây cơ cấu phân cấp tổ chức toàn xã (Cây đa tầng)',
  })
  @ApiSuccessResponse(
    OrganizationTreeResponseDTO,
    OrganizationTreeResponseSchema,
    'Lấy sơ đồ cây tổ chức thành công',
  )
  async findTree(): Promise<OrganizationTreeResponse> {
    return this.organizationsService.findTree();
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo mới một Hội / Tổ chức tiếp nhận (Chỉ dành riêng cho Admin)',
  })
  @ApiSuccessResponse(
    OrganizationResponseDTO,
    OrganizationResponseSchema,
    'Tạo tổ chức thành công',
    201,
  )
  async create(
    @Body() dto: CreateOrganizationRequestDTO,
  ): Promise<OrganizationResponse> {
    return this.organizationsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserType.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật thông tin Hội / Tổ chức tiếp nhận (Chỉ dành riêng cho Admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID của tổ chức' })
  @ApiSuccessResponse(
    OrganizationResponseDTO,
    OrganizationResponseSchema,
    'Cập nhật thông tin tổ chức thành công',
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationRequestDTO,
  ): Promise<OrganizationResponse> {
    return this.organizationsService.update(id, dto);
  }
}
