import { z } from 'zod';

export const UploadImageResponseSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
});

export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>;
