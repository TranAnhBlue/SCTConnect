import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { randomUUID } from 'crypto';

interface NormalizedError {
  field?: string;
  message: string;
}

interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string;
  errors: NormalizedError[] | null;
  timestamp: string;
  path: string;
  requestId: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  private static readonly PG_ERROR_CODES: Record<
    string,
    { statusCode: HttpStatus; message: string }
  > = {
    '23505': {
      statusCode: HttpStatus.CONFLICT,
      message: 'Dữ liệu đã tồn tại, vui lòng kiểm tra lại',
    },
    '23503': {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Dữ liệu tham chiếu không hợp lệ',
    },
    '23502': {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Thiếu dữ liệu bắt buộc',
    },
  };

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers['x-request-id'] as string) || randomUUID();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã có lỗi xảy ra từ máy chủ';
    let errors: NormalizedError[] | null = null;

    if (exception instanceof HttpException) {
      const result = this.handleHttpException(exception, requestId);
      statusCode = result.statusCode;
      message = result.message;
      errors = result.errors;
    } else if (exception instanceof QueryFailedError) {
      const result = this.handleQueryFailedError(exception, requestId);
      statusCode = result.statusCode;
      message = result.message;
    } else if (exception instanceof Error) {
      this.logger.error(
        `[requestId=${requestId}] [UnhandledException] ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error(
        `[requestId=${requestId}] [UnknownException] ${this.safeStringify(exception)}`,
      );
    }

    const body: ErrorResponseBody = {
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(statusCode).json(body);
  }

  private handleHttpException(
    exception: HttpException,
    requestId: string,
  ): { statusCode: number; message: string; errors: NormalizedError[] | null } {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Đã có lỗi xảy ra từ máy chủ';
    let errors: NormalizedError[] | null = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const resObj = exceptionResponse as Record<string, any>;
      message = resObj.message || exception.message || message;

      if (Array.isArray(resObj.errors)) {
        errors = resObj.errors.map((err: any) => ({
          field: Array.isArray(err.path)
            ? err.path.join('.')
            : err.path || err.field,
          message: err.message || 'Dữ liệu không hợp lệ',
        }));
      } else if (Array.isArray(resObj.message)) {
        errors = resObj.message.map((msg: string) => ({ message: msg }));
        message = 'Dữ liệu gửi lên không hợp lệ';
      }
    }

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[requestId=${requestId}] [HttpException 5xx] ${exception.message}`,
        exception.stack,
      );
    }

    return { statusCode, message, errors };
  }

  private handleQueryFailedError(
    exception: QueryFailedError,
    requestId: string,
  ): { statusCode: number; message: string } {
    this.logger.error(
      `[requestId=${requestId}] [DatabaseError] ${exception.message}`,
      exception.stack,
    );

    const driverError = (exception as any).driverError;
    const code = driverError?.code as string | undefined;

    if (code && HttpExceptionFilter.PG_ERROR_CODES[code]) {
      return HttpExceptionFilter.PG_ERROR_CODES[code];
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Đã có lỗi xảy ra từ máy chủ',
    };
  }

  private safeStringify(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
