import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { UserOrganization } from './entities/user-organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, UserOrganization])],
  exports: [TypeOrmModule],
})
export class OrganizationsModule {}
