import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
    @InjectRepository(UserOrganization)
    private readonly userOrganizationsRepository: Repository<UserOrganization>,
  ) {}

  async findUserOrganizations(userId: string): Promise<UserOrganization[]> {
    return this.userOrganizationsRepository.find({
      where: { userId },
      relations: {
        organization: true,
        role: true,
      },
      order: {
        isPrimary: 'DESC',
        joinedAt: 'ASC',
      },
    });
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' },
    });
  }
}
