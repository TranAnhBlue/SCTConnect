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
import { VillagesService } from './services/villages.service';
import {
  CreateVillageRequestDTO,
  UpdateVillageRequestDTO,
  QueryVillagesRequestDTO,
  VillageResponseDTO,
  VillageListResponseDTO,
} from './dto';
import {
  VillageResponse,
  VillageListResponse,
  VillageResponseSchema,
  VillageListResponseSchema,
} from './schemas';
import { UserType } from '../users/entities/user.entity';
import { ApiSuccessResponse, Public, Roles } from '../common/decorators';

@ApiTags('Địa bàn Hành chính Thôn / Tổ dân phố (Villages)')
@Controller('villages')
export class VillagesController {
  constructor(private readonly villagesService: VillagesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách các Thôn / Tổ dân phố toàn xã (Công khai)',
  })
  @ApiSuccessResponse(
    VillageListResponseDTO,
    VillageListResponseSchema,
    'Lấy danh sách Thôn / Tổ dân phố thành công',
  )
  async findAll(
    @Query() query: QueryVillagesRequestDTO,
  ): Promise<VillageListResponse> {
    return this.villagesService.findAll(query.search);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo mới một Thôn / Tổ dân phố (Chỉ dành riêng cho Admin)',
  })
  @ApiSuccessResponse(
    VillageResponseDTO,
    VillageResponseSchema,
    'Tạo Thôn / Tổ dân phố thành công',
    201,
  )
  async create(
    @Body() dto: CreateVillageRequestDTO,
  ): Promise<VillageResponse> {
    return this.villagesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserType.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật thông tin Thôn / Tổ dân phố (Chỉ dành riêng cho Admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID của Thôn / Tổ dân phố' })
  @ApiSuccessResponse(
    VillageResponseDTO,
    VillageResponseSchema,
    'Cập nhật Thôn / Tổ dân phố thành công',
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVillageRequestDTO,
  ): Promise<VillageResponse> {
    return this.villagesService.update(id, dto);
  }
}
