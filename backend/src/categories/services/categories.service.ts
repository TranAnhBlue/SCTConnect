import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import {
  CreateCategoryRequestDTO,
  UpdateCategoryRequestDTO,
} from '../dto';
import { CategoryResponse, CategoryListResponse } from '../schemas';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(search?: string): Promise<CategoryListResponse> {
    const qb = this.categoriesRepository
      .createQueryBuilder('cat')
      .where('cat.isActive = :isActive', { isActive: true })
      .orderBy('cat.createdAt', 'ASC');

    if (search) {
      qb.andWhere('(cat.code ILIKE :search OR cat.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const categories = await qb.getMany();

    return categories.map((cat) => ({
      id: cat.id,
      code: cat.code,
      name: cat.name,
      description: cat.description,
      isActive: cat.isActive,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
  }

  async findById(id: string): Promise<CategoryResponse> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy lĩnh vực phản ánh');
    }

    return {
      id: category.id,
      code: category.code,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(dto: CreateCategoryRequestDTO): Promise<CategoryResponse> {
    const existing = await this.categoriesRepository.findOne({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Mã lĩnh vực này đã tồn tại trong hệ thống');
    }

    const category = this.categoriesRepository.create({
      code: dto.code,
      name: dto.name,
      description: dto.description || null,
      isActive: true,
    });

    const saved = await this.categoriesRepository.save(category);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      description: saved.description,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }

  async update(
    id: string,
    dto: UpdateCategoryRequestDTO,
  ): Promise<CategoryResponse> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy lĩnh vực phản ánh');
    }

    if (dto.name !== undefined) {
      category.name = dto.name;
    }
    if (dto.description !== undefined) {
      category.description = dto.description;
    }
    if (dto.isActive !== undefined) {
      category.isActive = dto.isActive;
    }

    const saved = await this.categoriesRepository.save(category);

    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      description: saved.description,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
