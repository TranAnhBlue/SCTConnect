import { createZodDto } from 'nestjs-zod';
import { AuthTokensResponseSchema } from '../../schemas/responses/auth-tokens.response.schema';

export class AuthTokensResponseDTO extends createZodDto(
  AuthTokensResponseSchema,
) {}
