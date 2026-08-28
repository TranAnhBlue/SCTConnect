import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
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
    ApiExtraModels(dto),
    ApiResponse({
      status: statusCode,
      description: message,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: statusCode,
          },
          message: {
            type: 'string',
            example: message,
          },
          data: {
            $ref: getSchemaPath(dto),
          },
        },
        required: ['statusCode', 'message', 'data'],
      },
    }),
    ResponseMessage(message),
    Serialize(schema),
  );
}
