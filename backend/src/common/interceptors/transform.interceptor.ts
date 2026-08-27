import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZodType } from 'zod';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { SERIALIZE_SCHEMA_KEY } from '../decorators/serialize.decorator';

export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || 200;

    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'Thao tác thành công';

    const schema = this.reflector.getAllAndOverride<ZodType>(
      SERIALIZE_SCHEMA_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((rawData) => {
        const validatedData =
          schema && rawData !== null && rawData !== undefined
            ? schema.parse(rawData)
            : rawData;

        return {
          statusCode,
          message,
          data: validatedData,
        };
      }),
    );
  }
}
