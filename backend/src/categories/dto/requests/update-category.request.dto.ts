import { createZodDto } from 'nestjs-zod';
import { UpdateCategoryRequestSchema } from '../../schemas/requests/update-category.request.schema';

export class UpdateCategoryRequestDTO extends createZodDto(
  UpdateCategoryRequestSchema,
) {}
