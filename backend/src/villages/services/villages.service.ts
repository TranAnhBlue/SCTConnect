import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Village } from '../entities/village.entity';
import {
  CreateVillageRequestDTO,
  UpdateVillageRequestDTO,
} from '../dto';
import { VillageResponse, VillageListResponse } from '../schemas';

@Injectable()
export class VillagesService {
  constructor(
    @InjectRepository(Village)
    private readonly villagesRepository: Repository<Village>,
  ) {}

  async findAll(search?: string): Promise<VillageListResponse> {
    const qb = this.villagesRepository
      .createQueryBuilder('v')
      .where('v.isActive = :isActive', { isActive: true })
      .orderBy('v.name', 'ASC');

    if (search) {
      qb.andWhere('(v.name ILIKE :search OR v.code ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const villages = await qb.getMany();

    return villages.map((v) => ({
      id: v.id,
      code: v.code,
      name: v.name,
      isActive: v.isActive,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
  }

  async findById(id: string): Promise<VillageResponse> {
    const village = await this.villagesRepository.findOne({
      where: { id },
    });

    if (!village) {
      throw new NotFoundException('Không tìm thấy Thôn / Tổ dân phố');
    }

    return {
      id: village.id,
      code: village.code,
      name: village.name,
      isActive: village.isActive,
      createdAt: village.createdAt,
      updatedAt: village.updatedAt,
    };
  }

  async create(dto: CreateVillageRequestDTO): Promise<VillageResponse> {
    const existing = await this.villagesRepository.findOne({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Mã Thôn / TDP này đã tồn tại trong hệ thống');
    }

    const village = this.villagesRepository.create({
      code: dto.code,
      name: dto.name,
      isActive: true,
    });

    const saved = await this.villagesRepository.save(village);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  async update(
    id: string,
    dto: UpdateVillageRequestDTO,
  ): Promise<VillageResponse> {
    const village = await this.villagesRepository.findOne({
      where: { id },
    });

    if (!village) {
      throw new NotFoundException('Không tìm thấy Thôn / Tổ dân phố');
    }

    if (dto.name !== undefined) {
      village.name = dto.name;
    }
    if (dto.isActive !== undefined) {
      village.isActive = dto.isActive;
    }

    const saved = await this.villagesRepository.save(village);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
