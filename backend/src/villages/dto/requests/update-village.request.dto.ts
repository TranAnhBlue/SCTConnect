import { createZodDto } from 'nestjs-zod';
import { UpdateVillageRequestSchema } from '../../schemas/requests/update-village.request.schema';

export class UpdateVillageRequestDTO extends createZodDto(
  UpdateVillageRequestSchema,
) {}
