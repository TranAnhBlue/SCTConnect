import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback, FeedbackStatus } from '../entities/feedback.entity';
import { AuthenticatedUser } from '../../common/decorators';
import {
  toStartOfDayIso,
  toEndOfDayIso,
  isFatherlandFrontOrAdmin,
} from '../../common/utils';
import { QueryFeedbackStatisticsRequestDTO } from '../dto';
import { FeedbackStatisticsResponse } from '../schemas';

@Injectable()
export class FeedbacksStatisticsService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbacksRepository: Repository<Feedback>,
  ) {}

  async getStatistics(
    currentUser: AuthenticatedUser,
    query: QueryFeedbackStatisticsRequestDTO,
  ): Promise<FeedbackStatisticsResponse> {
    if (!isFatherlandFrontOrAdmin(currentUser)) {
      throw new ForbiddenException(
        'Chỉ Cán bộ Mặt trận Tổ quốc và Quản trị viên mới có quyền xem báo cáo thống kê toàn xã',
      );
    }

    const { fromDate, toDate, targetOrganizationId, incidentVillageId, categoryId } = query;

    const baseQb = this.feedbacksRepository.createQueryBuilder('fb');

    if (fromDate) {
      baseQb.andWhere('fb.createdAt >= :fromDate', {
        fromDate: toStartOfDayIso(fromDate),
      });
    }

    if (toDate) {
      baseQb.andWhere('fb.createdAt <= :toDate', {
        toDate: toEndOfDayIso(toDate),
      });
    }

    if (targetOrganizationId) {
      baseQb.andWhere('fb.targetOrganizationId = :targetOrganizationId', {
        targetOrganizationId,
      });
    }

    if (incidentVillageId) {
      baseQb.andWhere('fb.incidentVillageId = :incidentVillageId', {
        incidentVillageId,
      });
    }

    if (categoryId) {
      baseQb.andWhere('fb.categoryId = :categoryId', {
        categoryId,
      });
    }

    const [
      totalFeedbacks,
      totalPending,
      totalReceived,
      totalRejected,
      byOrganizationsRaw,
      byVillagesRaw,
      byCategoriesRaw,
    ] = await Promise.all([
      baseQb.clone().getCount(),
      baseQb
        .clone()
        .andWhere('fb.status = :status', { status: FeedbackStatus.PENDING })
        .getCount(),
      baseQb
        .clone()
        .andWhere('fb.status = :status', { status: FeedbackStatus.RECEIVED })
        .getCount(),
      baseQb
        .clone()
        .andWhere('fb.status = :status', { status: FeedbackStatus.REJECTED })
        .getCount(),
      baseQb
        .clone()
        .leftJoin('fb.targetOrganization', 'org')
        .select('org.id', 'key')
        .addSelect('org.name', 'name')
        .addSelect('COUNT(fb.id)', 'count')
        .groupBy('org.id')
        .addGroupBy('org.name')
        .getRawMany(),
      baseQb
        .clone()
        .leftJoin('fb.incidentVillage', 'village')
        .select('village.id', 'key')
        .addSelect('village.name', 'name')
        .addSelect('COUNT(fb.id)', 'count')
        .groupBy('village.id')
        .addGroupBy('village.name')
        .getRawMany(),
      baseQb
        .clone()
        .leftJoin('fb.category', 'cat')
        .select('cat.id', 'key')
        .addSelect('cat.name', 'name')
        .addSelect('COUNT(fb.id)', 'count')
        .groupBy('cat.id')
        .addGroupBy('cat.name')
        .getRawMany(),
    ]);

    return {
      totalFeedbacks,
      totalPending,
      totalReceived,
      totalRejected,
      byOrganizations: byOrganizationsRaw.map((row) => ({
        key: row.key || 'unknown',
        name: row.name || 'Không xác định',
        count: Number(row.count) || 0,
      })),
      byVillages: byVillagesRaw.map((row) => ({
        key: row.key || 'unknown',
        name: row.name || 'Không xác định',
        count: Number(row.count) || 0,
      })),
      byCategories: byCategoriesRaw.map((row) => ({
        key: row.key || 'other',
        name: row.name || 'Khác',
        count: Number(row.count) || 0,
      })),
    };
  }
}
