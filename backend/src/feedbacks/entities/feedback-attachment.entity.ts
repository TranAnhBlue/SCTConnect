import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Feedback } from './feedback.entity';

@Entity('feedback_attachments')
export class FeedbackAttachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_feedback_attachments_feedback_id')
  @Column({ name: 'feedback_id', type: 'uuid' })
  feedbackId!: string;

  @ManyToOne(() => Feedback, (fb) => fb.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'feedback_id' })
  feedback!: Feedback;

  @Column({ name: 'file_url', type: 'text' })
  fileUrl!: string;

  @Column({
    name: 'file_type',
    type: 'varchar',
    length: 50,
    default: 'image/jpeg',
  })
  fileType!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;
}
