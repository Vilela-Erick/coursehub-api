import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CourseForbiddenError, CourseNotFoundError } from '../../courses/application/course-errors';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof CourseNotFoundError
      ? HttpStatus.NOT_FOUND
      : exception instanceof CourseForbiddenError
        ? HttpStatus.FORBIDDEN
        : exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(JSON.stringify({
        method: request.method,
        path: request.path,
        status,
        errorType: exception instanceof Error ? exception.name : 'UnknownError',
      }));
    }

    const detail = exception instanceof HttpException ? exception.getResponse() : null;
    const message = status === HttpStatus.INTERNAL_SERVER_ERROR
      ? 'Internal server error'
      : exception instanceof CourseNotFoundError || exception instanceof CourseForbiddenError
        ? exception.message
      : typeof detail === 'string'
        ? detail
        : detail && typeof detail === 'object' && 'message' in detail
          ? detail.message
          : 'Request failed';

    response.status(status).json({
      statusCode: status,
      path: request.path,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
