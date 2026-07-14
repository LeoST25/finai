import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '../http-response';

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<
  T,
  HttpResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<HttpResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        if (data instanceof HttpResponse) {
          return data;
        }

        return HttpResponse.ok(data);
      }),
    );
  }
}
