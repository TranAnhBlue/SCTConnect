import { createZodDto } from 'nestjs-zod';
import { RefreshTokenRequestSchema } from '../../schemas/requests/refresh-token.request.schema';

export class RefreshTokenRequestDTO extends createZodDto(
  RefreshTokenRequestSchema,
) {}
