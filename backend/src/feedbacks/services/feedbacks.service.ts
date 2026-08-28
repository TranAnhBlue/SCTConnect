import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  Feedback,
  FeedbackStatus,
} from '../entities/feedback.entity';
import { FeedbackAttachment } from '../entities/feedback-attachment.entity';
import { UserType } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Village } from '../../villages/entities/village.entity';
import { Category } from '../../categories/entities/category.entity';
import { AuthenticatedUser } from '../../common/decorators';
import {
  toStartOfDayIso,
  toEndOfDayIso,
  isFatherlandFrontOrAdmin,
} from '../../common/utils';
import {
  CreateFeedbackRequestDTO,
  QueryFeedbacksRequestDTO,
  UpdateFeedbackStatusRequestDTO,
} from '../dto';
import {
  FeedbackResponse,
  PaginatedFeedbacksResponse,
} from '../schemas';
import { FeedbackResponseMapper } from '../mappers';

@Injectable()
export class FeedbacksService implements OnModuleInit {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbacksRepository: Repository<Feedback>,
    @InjectRepository(FeedbackAttachment)
    private readonly attachmentsRepository: Repository<FeedbackAttachment>,
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
    @InjectRepository(Village)
    private readonly villagesRepository: Repository<Village>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.feedbacksRepository.query(
      `CREATE SEQUENCE IF NOT EXISTS feedback_code_seq START WITH 1 INCREMENT BY 1;`,
    );
  }

  private async generateFeedbackCode(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await this.feedbacksRepository.query(
      `SELECT nextval('feedback_code_seq') AS next_val;`,
    );
    const seqNum = result[0]?.next_val || 1;
    const sequence = String(seqNum).padStart(4, '0');
    return `PA-${year}-${sequence}`;
  }

  private async paginateFeedbacks(
    filterQb: SelectQueryBuilder<Feedback>,
    page = 1,
    limit = 20,
  ): Promise<PaginatedFeedbacksResponse> {
    filterQb
      .leftJoinAndSelect('fb.user', 'user')
      .leftJoinAndSelect('fb.targetOrganization', 'targetOrganization')
      .leftJoinAndSelect('fb.incidentVillage', 'incidentVillage')
      .leftJoinAndSelect('fb.category', 'category')
      .leftJoinAndSelect('fb.attachments', 'attachments')
      .orderBy('fb.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, totalItems] = await filterQb.getManyAndCount();

    return {
      items: FeedbackResponseMapper.toResponseList(items),
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async create(
    userId: string,
    dto: CreateFeedbackRequestDTO,
  ): Promise<FeedbackResponse> {
    const targetOrg = await this.organizationsRepository.findOne({
      where: { id: dto.targetOrganizationId, isActive: true },
    });
    if (!targetOrg) {
      throw new BadRequestException('Tổ chức / Hội tiếp nhận không tồn tại');
    }

    const village = await this.villagesRepository.findOne({
      where: { id: dto.incidentVillageId, isActive: true },
    });
    if (!village) {
      throw new BadRequestException('Thôn / Tổ dân phố không tồn tại');
    }

    const category = await this.categoriesRepository.findOne({
      where: { id: dto.categoryId, isActive: true },
    });
    if (!category) {
      throw new BadRequestException('Lĩnh vực phản ánh không tồn tại');
    }

    const code = await this.generateFeedbackCode();

    const feedback = this.feedbacksRepository.create({
      code,
      userId,
      targetOrganizationId: dto.targetOrganizationId,
      incidentVillageId: dto.incidentVillageId,
      categoryId: dto.categoryId,
      address: dto.address || null,
      title: dto.title,
      content: dto.content,
      status: FeedbackStatus.PENDING,
    });

    const savedFeedback = await this.feedbacksRepository.save(feedback);

    if (dto.attachments && dto.attachments.length > 0) {
      const attachments = dto.attachments.map((url) =>
        this.attachmentsRepository.create({
          feedbackId: savedFeedback.id,
          fileUrl: url,
          fileType: 'image/jpeg',
        }),
      );
      await this.attachmentsRepository.save(attachments);
    }

    return this.findOneById(savedFeedback.id);
  }

  async findMeFeedbacks(
    userId: string,
    query: QueryFeedbacksRequestDTO,
  ): Promise<PaginatedFeedbacksResponse> {
    const { page = 1, limit = 20, status, search, categoryId } = query;

    const filterQb = this.feedbacksRepository
      .createQueryBuilder('fb')
      .where('fb.userId = :userId', { userId });

    if (status) {
      filterQb.andWhere('fb.status = :status', { status });
    }

    if (categoryId) {
      filterQb.andWhere('fb.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      filterQb.andWhere(
        '(fb.code ILIKE :search OR fb.title ILIKE :search OR fb.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return this.paginateFeedbacks(filterQb, page, limit);
  }

  async findOneMeFeedback(
    userId: string,
    id: string,
  ): Promise<FeedbackResponse> {
    const feedback = await this.feedbacksRepository.findOne({
      where: { id, userId },
      relations: {
        targetOrganization: true,
        incidentVillage: true,
        category: true,
        attachments: true,
        user: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException('Không tìm thấy phản ánh này của bạn');
    }

    return FeedbackResponseMapper.toResponse(feedback);
  }

  async findAll(
    currentUser: AuthenticatedUser,
    query: QueryFeedbacksRequestDTO,
  ): Promise<PaginatedFeedbacksResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      targetOrganizationId,
      incidentVillageId,
      categoryId,
      status,
      fromDate,
      toDate,
    } = query;

    const isFatherlandFrontOrAdminUser = isFatherlandFrontOrAdmin(currentUser);

    const filterQb = this.feedbacksRepository
      .createQueryBuilder('fb');

    if (!isFatherlandFrontOrAdminUser) {
      if (!currentUser.organizationId) {
        throw new ForbiddenException(
          'Tài khoản cán bộ chưa được gán vào tổ chức tiếp nhận',
        );
      }
      filterQb.andWhere('fb.targetOrganizationId = :orgId', {
        orgId: currentUser.organizationId,
      });
    } else if (targetOrganizationId) {
      filterQb.andWhere('fb.targetOrganizationId = :targetOrgId', {
        targetOrgId: targetOrganizationId,
      });
    }

    if (incidentVillageId) {
      filterQb.andWhere('fb.incidentVillageId = :incidentVillageId', {
        incidentVillageId,
      });
    }

    if (categoryId) {
      filterQb.andWhere('fb.categoryId = :categoryId', { categoryId });
    }

    if (status) {
      filterQb.andWhere('fb.status = :status', { status });
    }

    if (search) {
      filterQb
        .leftJoin('fb.user', 'user_search')
        .andWhere(
          '(fb.code ILIKE :search OR fb.title ILIKE :search OR fb.content ILIKE :search OR user_search.fullName ILIKE :search OR user_search.phone ILIKE :search)',
          { search: `%${search}%` },
        );
    }

    if (fromDate) {
      filterQb.andWhere('fb.createdAt >= :fromDate', {
        fromDate: toStartOfDayIso(fromDate),
      });
    }

    if (toDate) {
      filterQb.andWhere('fb.createdAt <= :toDate', {
        toDate: toEndOfDayIso(toDate),
      });
    }

    return this.paginateFeedbacks(filterQb, page, limit);
  }

  async findOne(
    currentUser: AuthenticatedUser,
    id: string,
  ): Promise<FeedbackResponse> {
    const feedback = await this.findOneById(id);

    const isFatherlandFrontOrAdminUser = isFatherlandFrontOrAdmin(currentUser);

    if (!isFatherlandFrontOrAdminUser) {
      if (feedback.targetOrganizationId !== currentUser.organizationId) {
        throw new ForbiddenException(
          'Bạn không có quyền xem phản ánh gửi tới tổ chức khác',
        );
      }
    }

    return feedback;
  }

  async updateStatus(
    currentUser: AuthenticatedUser,
    id: string,
    dto: UpdateFeedbackStatusRequestDTO,
  ): Promise<FeedbackResponse> {
    const feedback = await this.feedbacksRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException('Không tìm thấy phản ánh trong hệ thống');
    }

    const isFatherlandFrontOrAdminUser = isFatherlandFrontOrAdmin(currentUser);

    if (!isFatherlandFrontOrAdminUser) {
      if (feedback.targetOrganizationId !== currentUser.organizationId) {
        throw new ForbiddenException(
          'Bạn không có quyền cập nhật trạng thái phản ánh của tổ chức khác',
        );
      }
    }

    feedback.status = dto.status;
    await this.feedbacksRepository.save(feedback);

    return this.findOneById(id);
  }

  private async findOneById(id: string): Promise<FeedbackResponse> {
    const feedback = await this.feedbacksRepository.findOne({
      where: { id },
      relations: {
        user: true,
        targetOrganization: true,
        incidentVillage: true,
        category: true,
        attachments: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException('Không tìm thấy phản ánh trong hệ thống');
    }

    return FeedbackResponseMapper.toResponse(feedback);
  }
}
