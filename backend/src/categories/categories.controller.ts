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
import { CategoriesService } from './services/categories.service';
import {
  CreateCategoryRequestDTO,
  UpdateCategoryRequestDTO,
  QueryCategoriesRequestDTO,
  CategoryResponseDTO,
  CategoryListResponseDTO,
} from './dto';
import {
  CategoryResponse,
  CategoryListResponse,
  CategoryResponseSchema,
  CategoryListResponseSchema,
} from './schemas';
import { UserType } from '../users/entities/user.entity';
import { Public, Roles, ApiSuccessResponse } from '../common/decorators';

@ApiTags('Danh mục Lĩnh vực Phản ánh (Categories)')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách các lĩnh vực phản ánh dân nguyện đang hoạt động',
  })
  @ApiSuccessResponse(
    CategoryListResponseDTO,
    CategoryListResponseSchema,
    'Lấy danh sách lĩnh vực phản ánh thành công',
  )
  async findAll(
    @Query() query: QueryCategoriesRequestDTO,
  ): Promise<CategoryListResponse> {
    return this.categoriesService.findAll(query.search);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo lĩnh vực phản ánh mới (Chỉ dành riêng cho Admin)',
  })
  @ApiSuccessResponse(
    CategoryResponseDTO,
    CategoryResponseSchema,
    'Tạo lĩnh vực phản ánh thành công',
    201,
  )
  async create(
    @Body() dto: CreateCategoryRequestDTO,
  ): Promise<CategoryResponse> {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserType.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật lĩnh vực phản ánh (Chỉ dành riêng cho Admin)',
  })
  @ApiParam({ name: 'id', description: 'UUID của lĩnh vực phản ánh' })
  @ApiSuccessResponse(
    CategoryResponseDTO,
    CategoryResponseSchema,
    'Cập nhật lĩnh vực phản ánh thành công',
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryRequestDTO,
  ): Promise<CategoryResponse> {
    return this.categoriesService.update(id, dto);
  }
}
