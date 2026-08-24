import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_organizations')
@Unique('uq_user_organization_role', ['userId', 'organizationId', 'roleId'])
@Index('uq_user_single_primary_org', ['userId'], {
  unique: true,
  where: '"is_primary" = true',
})
export class UserOrganization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_user_organizations_user_id')
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Index('idx_user_organizations_org_id')
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Index('idx_user_organizations_role_id')
  @Column({ name: 'role_id', type: 'uuid' })
  roleId!: string;

  @Column({ name: 'title_name', type: 'varchar', length: 100 })
  titleName!: string;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;

  @Column({
    name: 'joined_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  joinedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.userOrganizations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Organization, (org) => org.userOrganizations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @ManyToOne(() => Role, (role) => role.userOrganizations, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
