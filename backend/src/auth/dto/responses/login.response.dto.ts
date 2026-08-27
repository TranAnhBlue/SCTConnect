import { createZodDto } from 'nestjs-zod';
import { LoginResponseSchema } from '../../schemas/responses/login.response.schema';

export class LoginResponseDTO extends createZodDto(LoginResponseSchema) {}
