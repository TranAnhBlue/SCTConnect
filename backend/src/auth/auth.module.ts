import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UserOrganization } from '../organizations/entities/user-organization.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserOrganization, RolePermission]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
