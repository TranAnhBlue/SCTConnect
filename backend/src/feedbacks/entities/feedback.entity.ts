import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Village } from '../../villages/entities/village.entity';
import { Category } from '../../categories/entities/category.entity';
import { FeedbackAttachment } from './feedback-attachment.entity';

export enum FeedbackStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  REJECTED = 'rejected',
}

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_feedbacks_code', { unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Index('idx_feedbacks_user_id')
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Index('idx_feedbacks_target_org_id')
  @Column({ name: 'target_organization_id', type: 'uuid' })
  targetOrganizationId!: string;

  @ManyToOne(() => Organization, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'target_organization_id' })
  targetOrganization!: Organization;

  @Index('idx_feedbacks_incident_village_id')
  @Column({ name: 'incident_village_id', type: 'uuid' })
  incidentVillageId!: string;

  @ManyToOne(() => Village, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'incident_village_id' })
  incidentVillage!: Village;

  @Index('idx_feedbacks_category_id')
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Index('idx_feedbacks_status')
  @Column({
    type: 'varchar',
    length: 30,
    default: FeedbackStatus.PENDING,
  })
  status!: FeedbackStatus | string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @OneToMany(() => FeedbackAttachment, (att) => att.feedback, {
    cascade: true,
  })
  attachments!: FeedbackAttachment[];
}
