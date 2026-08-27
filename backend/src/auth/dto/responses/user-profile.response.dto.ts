import { createZodDto } from 'nestjs-zod';
import { UserProfileResponseSchema } from '../../schemas/responses/user-profile.response.schema';

export class UserProfileResponseDTO extends createZodDto(
  UserProfileResponseSchema,
) {}
