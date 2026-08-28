import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackAttachment } from './entities/feedback-attachment.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Village } from '../villages/entities/village.entity';
import { Category } from '../categories/entities/category.entity';
import { FeedbacksService } from './services/feedbacks.service';
import { FeedbacksStatisticsService } from './services/feedbacks-statistics.service';
import { FeedbacksController } from './feedbacks.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feedback,
      FeedbackAttachment,
      Organization,
      Village,
      Category,
    ]),
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService, FeedbacksStatisticsService],
  exports: [FeedbacksService, FeedbacksStatisticsService, TypeOrmModule],
})
export class FeedbacksModule {}
