import { createZodDto } from 'nestjs-zod';
import { CreateVillageRequestSchema } from '../../schemas/requests/create-village.request.schema';

export class CreateVillageRequestDTO extends createZodDto(
  CreateVillageRequestSchema,
) {}
