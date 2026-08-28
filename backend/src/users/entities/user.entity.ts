import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Village } from '../../villages/entities/village.entity';
import { Organization } from '../../organizations/entities/organization.entity';

export enum UserType {
  CITIZEN = 'citizen',
  OFFICER = 'officer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_users_phone', { unique: true })
  @Column({ type: 'varchar', length: 20, unique: true })
  phone!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Index('idx_users_village_id')
  @Column({ name: 'village_id', type: 'uuid', nullable: true })
  villageId!: string | null;

  @ManyToOne(() => Village, (v) => v.users, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'village_id' })
  village!: Village | null;

  @Column({ name: 'password_hash', type: 'text', select: false })
  passwordHash!: string;

  @Column({
    name: 'user_type',
    type: 'varchar',
    length: 30,
    default: UserType.CITIZEN,
  })
  userType!: UserType | string;

  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId!: string | null;

  @ManyToOne(() => Organization, (org) => org.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({
    name: 'last_login_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  lastLoginAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;
}
