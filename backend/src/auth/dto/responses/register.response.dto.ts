import { createZodDto } from 'nestjs-zod';
import { RegisterResponseSchema } from '../../schemas/responses/register.response.schema';

export class RegisterResponseDTO extends createZodDto(RegisterResponseSchema) {}
