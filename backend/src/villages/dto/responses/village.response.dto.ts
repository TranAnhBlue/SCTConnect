import { createZodDto } from 'nestjs-zod';
import {
  VillageResponseSchema,
  VillageListResponseSchema,
} from '../../schemas/responses/village.response.schema';

export class VillageResponseDTO extends createZodDto(VillageResponseSchema) {}

export class VillageListResponseDTO extends createZodDto(
  VillageListResponseSchema,
) {}
