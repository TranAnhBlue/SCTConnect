import { createZodDto } from 'nestjs-zod';
import { CreateCategoryRequestSchema } from '../../schemas/requests/create-category.request.schema';

export class CreateCategoryRequestDTO extends createZodDto(
  CreateCategoryRequestSchema,
) {}
