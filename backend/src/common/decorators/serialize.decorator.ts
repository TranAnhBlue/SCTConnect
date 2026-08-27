import { SetMetadata } from '@nestjs/common';
import { ZodTypeAny } from 'zod';

export const SERIALIZE_SCHEMA_KEY = 'serialize_schema';
export const Serialize = (schema: ZodTypeAny) =>
  SetMetadata(SERIALIZE_SCHEMA_KEY, schema);
