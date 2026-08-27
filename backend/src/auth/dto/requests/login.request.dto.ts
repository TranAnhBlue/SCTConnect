import { createZodDto } from 'nestjs-zod';
import { LoginRequestSchema } from '../../schemas/requests/login.request.schema';

export class LoginRequestDTO extends createZodDto(LoginRequestSchema) {}
