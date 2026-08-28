import { z } from 'zod';
import { UserResponseSchema } from '../../../users/schemas/responses/user.response.schema';

export const UserProfileResponseSchema = UserResponseSchema;

export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
