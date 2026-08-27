import { createZodDto } from 'nestjs-zod';
import { UserResponseSchema } from '../../schemas/responses/user.response.schema';

export class UserResponseDTO extends createZodDto(UserResponseSchema) {}
