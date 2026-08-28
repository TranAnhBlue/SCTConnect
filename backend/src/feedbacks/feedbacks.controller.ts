import {
  Controller,
  Get,
  Post,
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
import { FeedbacksService } from './services/feedbacks.service';
import { FeedbacksStatisticsService } from './services/feedbacks-statistics.service';
import {
  CreateFeedbackRequestDTO,
  QueryFeedbacksRequestDTO,
  UpdateFeedbackStatusRequestDTO,
  QueryFeedbackStatisticsRequestDTO,
  FeedbackResponseDTO,
  PaginatedFeedbacksResponseDTO,
  FeedbackStatisticsResponseDTO,
} from './dto';
import {
  FeedbackResponse,
  PaginatedFeedbacksResponse,
  FeedbackStatisticsResponse,
  FeedbackResponseSchema,
  PaginatedFeedbacksResponseSchema,
  FeedbackStatisticsResponseSchema,
} from './schemas';
import { UserType } from '../users/entities/user.entity';
import {
  CurrentUser,
  AuthenticatedUser,
  Roles,
  ApiSuccessResponse,
} from '../common/decorators';

@ApiTags('Phản Ánh Dân Nguyện (Feedbacks)')
@ApiBearerAuth()
@Controller('feedbacks')
export class FeedbacksController {
  constructor(
    private readonly feedbacksService: FeedbacksService,
    private readonly feedbacksStatisticsService: FeedbacksStatisticsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Công dân gửi phản ánh ý kiến dân nguyện hiện trường',
  })
  @ApiSuccessResponse(
    FeedbackResponseDTO,
    FeedbackResponseSchema,
    'Gửi phản ánh dân nguyện thành công',
  )
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateFeedbackRequestDTO,
  ): Promise<FeedbackResponse> {
    return this.feedbacksService.create(userId, dto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Công dân xem danh sách phản ánh do chính mình đã gửi',
  })
  @ApiSuccessResponse(
    PaginatedFeedbacksResponseDTO,
    PaginatedFeedbacksResponseSchema,
    'Lấy danh sách phản ánh của tôi thành công',
  )
  async findMeFeedbacks(
    @CurrentUser('id') userId: string,
    @Query() query: QueryFeedbacksRequestDTO,
  ): Promise<PaginatedFeedbacksResponse> {
    return this.feedbacksService.findMeFeedbacks(userId, query);
  }

  @Get('me/:id')
  @ApiOperation({
    summary: 'Công dân xem chi tiết 1 phản ánh của chính mình',
  })
  @ApiParam({ name: 'id', description: 'UUID phản ánh' })
  @ApiSuccessResponse(
    FeedbackResponseDTO,
    FeedbackResponseSchema,
    'Lấy chi tiết phản ánh thành công',
  )
  async findOneMeFeedback(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FeedbackResponse> {
    return this.feedbacksService.findOneMeFeedback(userId, id);
  }

  @Get('statistics')
  @Roles(UserType.OFFICER, UserType.ADMIN)
  @ApiOperation({
    summary:
      'Báo cáo tổng hợp số liệu dân nguyện toàn xã cho Đảng ủy, HĐND & UBND (Dành cho MTTQ/Admin)',
  })
  @ApiSuccessResponse(
    FeedbackStatisticsResponseDTO,
    FeedbackStatisticsResponseSchema,
    'Lấy báo cáo thống kê dân nguyện thành công',
  )
  async getStatistics(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: QueryFeedbackStatisticsRequestDTO,
  ): Promise<FeedbackStatisticsResponse> {
    return this.feedbacksStatisticsService.getStatistics(currentUser, query);
  }

  @Get()
  @Roles(UserType.OFFICER, UserType.ADMIN)
  @ApiOperation({
    summary:
      'Cán bộ xem danh sách phản ánh (MTTQ xem toàn xã; Cán bộ Hội chỉ xem Hội mình)',
  })
  @ApiSuccessResponse(
    PaginatedFeedbacksResponseDTO,
    PaginatedFeedbacksResponseSchema,
    'Lấy danh sách phản ánh thành công',
  )
  async findAll(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: QueryFeedbacksRequestDTO,
  ): Promise<PaginatedFeedbacksResponse> {
    return this.feedbacksService.findAll(currentUser, query);
  }

  @Get(':id')
  @Roles(UserType.OFFICER, UserType.ADMIN)
  @ApiOperation({
    summary:
      'Cán bộ xem chi tiết nội dung và ảnh hiện trường phản ánh theo ID',
  })
  @ApiParam({ name: 'id', description: 'UUID phản ánh' })
  @ApiSuccessResponse(
    FeedbackResponseDTO,
    FeedbackResponseSchema,
    'Lấy chi tiết phản ánh thành công',
  )
  async findOne(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FeedbackResponse> {
    return this.feedbacksService.findOne(currentUser, id);
  }

  @Patch(':id/status')
  @Roles(UserType.OFFICER, UserType.ADMIN)
  @ApiOperation({
    summary: 'Cán bộ 1-Click tiếp nhận hoặc từ chối phản ánh',
  })
  @ApiParam({ name: 'id', description: 'UUID phản ánh' })
  @ApiSuccessResponse(
    FeedbackResponseDTO,
    FeedbackResponseSchema,
    'Cập nhật trạng thái tiếp nhận thành công',
  )
  async updateStatus(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFeedbackStatusRequestDTO,
  ): Promise<FeedbackResponse> {
    return this.feedbacksService.updateStatus(currentUser, id, dto);
  }
}
