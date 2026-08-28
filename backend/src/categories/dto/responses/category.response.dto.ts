import { createZodDto } from 'nestjs-zod';
import {
  CategoryResponseSchema,
  CategoryListResponseSchema,
} from '../../schemas/responses/category.response.schema';

export class CategoryResponseDTO extends createZodDto(
  CategoryResponseSchema,
) {}

export class CategoryListResponseDTO extends createZodDto(
  CategoryListResponseSchema,
) {}
