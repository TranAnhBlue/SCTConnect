import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
  OrganizationTreeNode,
  OrganizationTreeResponse,
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
      parentOrganizationId: org.parentOrganizationId,
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
      parentOrganizationId: org.parentOrganizationId,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }

  async getTree(): Promise<OrganizationTreeResponse> {
    const organizations = await this.organizationsRepository.find({
      order: { createdAt: 'ASC' },
    });
    const toTreeNode = (organization: Organization): OrganizationTreeNode => ({
      id: organization.id,
      code: organization.code,
      name: organization.name,
      type: organization.type,
      isActive: organization.isActive,
      parentOrganizationId: organization.parentOrganizationId,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      children: [],
    });
    const nodesById = new Map(organizations.map((organization) => [organization.id, toTreeNode(organization)]));
    const roots: OrganizationTreeNode[] = [];

    organizations.forEach((organization) => {
      const node = nodesById.get(organization.id)!;
      const parent = organization.parentOrganizationId
        ? nodesById.get(organization.parentOrganizationId)
        : undefined;

      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
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

    if (dto.parentOrganizationId) {
      await this.ensureParentExists(dto.parentOrganizationId);
    }

    const org = this.organizationsRepository.create({
      code: dto.code,
      name: dto.name,
      type: dto.type,
      isActive: true,
      parentOrganizationId: dto.parentOrganizationId || null,
    });

    const saved = await this.organizationsRepository.save(org);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      type: saved.type,
      isActive: saved.isActive,
      parentOrganizationId: saved.parentOrganizationId,
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
    if (dto.parentOrganizationId !== undefined) {
      await this.ensureValidParent(id, dto.parentOrganizationId);
      org.parentOrganizationId = dto.parentOrganizationId;
    }

    const saved = await this.organizationsRepository.save(org);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      type: saved.type,
      isActive: saved.isActive,
      parentOrganizationId: saved.parentOrganizationId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  private async ensureParentExists(parentOrganizationId: string): Promise<void> {
    const parent = await this.organizationsRepository.findOne({ where: { id: parentOrganizationId } });
    if (!parent) {
      throw new NotFoundException('Tổ chức cấp trên không tồn tại');
    }
  }

  private async ensureValidParent(id: string, parentOrganizationId: string | null): Promise<void> {
    if (!parentOrganizationId) {
      return;
    }
    if (parentOrganizationId === id) {
      throw new BadRequestException('Không thể chọn chính tổ chức này làm cấp trên');
    }

    let currentParentId: string | null = parentOrganizationId;
    while (currentParentId) {
      if (currentParentId === id) {
        throw new BadRequestException('Không thể tạo vòng lặp trong sơ đồ tổ chức');
      }
      const parent = await this.organizationsRepository.findOne({
        where: { id: currentParentId },
        select: { id: true, parentOrganizationId: true },
      });
      if (!parent) {
        throw new NotFoundException('Tổ chức cấp trên không tồn tại');
      }
      currentParentId = parent.parentOrganizationId;
    }
  }
}
