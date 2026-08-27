import { createZodDto } from 'nestjs-zod';
import { RegisterRequestSchema } from '../../schemas/requests/register.request.schema';

export class RegisterRequestDTO extends createZodDto(RegisterRequestSchema) {}
