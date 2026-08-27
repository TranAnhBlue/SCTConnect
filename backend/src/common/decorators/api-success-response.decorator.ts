import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ZodTypeAny } from 'zod';
import { ResponseMessage } from './response-message.decorator';
import { Serialize } from './serialize.decorator';

export function ApiSuccessResponse<T>(
  dto: Type<T>,
  schema: ZodTypeAny,
  message: string,
  statusCode: number = 200,
) {
  return applyDecorators(
    ApiResponse({ status: statusCode, type: dto }),
    ResponseMessage(message),
    Serialize(schema),
  );
}
