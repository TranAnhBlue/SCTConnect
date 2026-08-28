import { createZodDto } from 'nestjs-zod';
import { UploadImageResponseSchema } from '../../schemas/responses/upload-image.response.schema';

export class UploadImageResponseDTO extends createZodDto(
  UploadImageResponseSchema,
) {}
