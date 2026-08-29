import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import {
  QueryOrganizationsRequestDTO,
  CreateOrganizationRequestDTO,
  UpdateOrganizationRequestDTO,
} from '../dto';
import {
  OrganizationResponse,
  OrganizationListResponse,
} from '../schemas';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {}

  async findAll(
    query?: QueryOrganizationsRequestDTO,
  ): Promise<OrganizationListResponse> {
    const qb = this.organizationsRepository
      .createQueryBuilder('org')
      .orderBy('org.createdAt', 'ASC');

    if (query?.search) {
      qb.andWhere('(org.name ILIKE :search OR org.code ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query?.type) {
      qb.andWhere('org.type = :type', { type: query.type });
    }

    if (query?.isActive !== undefined) {
      qb.andWhere('org.isActive = :isActive', { isActive: query.isActive });
    }

    const organizations = await qb.getMany();

    return organizations.map((org) => ({
      id: org.id,
      code: org.code,
      name: org.name,
      type: org.type,
      isActive: org.isActive,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    }));
  }

  async findById(id: string): Promise<OrganizationResponse> {
    const org = await this.organizationsRepository.findOne({
      where: { id },
    });

    if (!org) {
      throw new NotFoundException('Không tìm thấy tổ chức / hội đoàn thể');
    }

    return {
      id: org.id,
      code: org.code,
      name: org.name,
      type: org.type,
      isActive: org.isActive,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }

  async create(
    dto: CreateOrganizationRequestDTO,
  ): Promise<OrganizationResponse> {
    const existing = await this.organizationsRepository.findOne({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Mã tổ chức này đã tồn tại trong hệ thống');
    }

    const org = this.organizationsRepository.create({
      code: dto.code,
      name: dto.name,
      type: dto.type,
      isActive: true,
    });

    const saved = await this.organizationsRepository.save(org);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      type: saved.type,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  async update(
    id: string,
    dto: UpdateOrganizationRequestDTO,
  ): Promise<OrganizationResponse> {
    const org = await this.organizationsRepository.findOne({
      where: { id },
    });

    if (!org) {
      throw new NotFoundException('Không tìm thấy tổ chức / hội đoàn thể');
    }

    if (dto.name !== undefined) {
      org.name = dto.name;
    }
    if (dto.type !== undefined) {
      org.type = dto.type;
    }
    if (dto.isActive !== undefined) {
      org.isActive = dto.isActive;
    }

    const saved = await this.organizationsRepository.save(org);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      type: saved.type,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
