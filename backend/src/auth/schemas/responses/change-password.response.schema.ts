import { z } from 'zod';

export const ChangePasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ChangePasswordResponse = z.infer<
  typeof ChangePasswordResponseSchema
>;
