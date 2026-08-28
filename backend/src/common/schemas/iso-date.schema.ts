import { z } from 'zod';

export type IsoDate = Date | string;

export const IsoDateSchema = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  return val;
}, z.string().datetime()) as unknown as z.ZodType<IsoDate>;
