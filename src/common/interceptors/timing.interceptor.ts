import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startedAt = Date.now();
    return next.handle().pipe(finalize(() => {
      this.logger.log(JSON.stringify({
        method: request.method,
        path: request.path,
        durationMs: Date.now() - startedAt,
      }));
    }));
  }
}
