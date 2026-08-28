import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Village } from '../villages/entities/village.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { UsersService } from './services/users.service';
import { UsersAdminService } from './services/users-admin.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Village, Organization])],
  controllers: [UsersController],
  providers: [UsersService, UsersAdminService],
  exports: [UsersService, UsersAdminService, TypeOrmModule],
})
export class UsersModule {}
