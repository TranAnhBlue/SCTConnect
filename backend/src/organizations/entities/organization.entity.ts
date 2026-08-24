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
import { UserOrganization } from './user-organization.entity';

export enum OrganizationType {
  MTTQ_CORE = 'mttq_core',
  YOUTH_UNION = 'youth_union',
  WOMEN_UNION = 'women_union',
  FARMERS_UNION = 'farmers_union',
  VETERANS_UNION = 'veterans_union',
  TDP_FRONT = 'tdp_front',
  YOUTH_BRANCH = 'youth_branch',
  WOMEN_BRANCH = 'women_branch',
  STATE_AUTHORITY = 'state_authority',
  OTHER = 'other',
}

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_organizations_parent_id')
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId!: string | null;

  @Index('idx_organizations_code', { unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: OrganizationType.OTHER,
  })
  type!: OrganizationType | string;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  hotline!: string | null;

  @Column({ type: 'jsonb', default: {} })
  settings!: Record<string, any>;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @ManyToOne(() => Organization, (org) => org.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: Organization | null;

  @OneToMany(() => Organization, (org) => org.parent)
  children!: Organization[];

  @OneToMany(() => UserOrganization, (userOrg) => userOrg.organization)
  userOrganizations!: UserOrganization[];
}
