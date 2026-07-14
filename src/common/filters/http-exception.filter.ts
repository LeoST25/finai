import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { HttpResponse } from '../http-response';

type NestValidationError = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : Number(HttpStatus.INTERNAL_SERVER_ERROR);

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const parsedResponse = this.parseExceptionResponse(exceptionResponse);

    const isInternalServerError =
      status === Number(HttpStatus.INTERNAL_SERVER_ERROR);

    const message = isInternalServerError
      ? 'Ocorreu um erro interno no servidor.'
      : parsedResponse.message;

    const body = {
      ...HttpResponse.fail(message, parsedResponse.errors),
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private parseExceptionResponse(response: unknown): {
    message: string;
    errors?: unknown;
  } {
    if (typeof response === 'string') {
      return {
        message: response,
      };
    }

    if (!this.isValidationError(response)) {
      return {
        message: 'Não foi possível realizar a operação.',
      };
    }

    if (Array.isArray(response.message)) {
      return {
        message: 'Dados inválidos.',
        errors: response.message,
      };
    }

    return {
      message:
        response.message ??
        response.error ??
        'Não foi possível realizar a operação.',
    };
  }

  private isValidationError(value: unknown): value is NestValidationError {
    return typeof value === 'object' && value !== null;
  }
}
