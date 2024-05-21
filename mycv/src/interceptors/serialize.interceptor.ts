import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): NonNullable<unknown>;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //Run something before a request is handled
    //by the request handler
    return next.handle().pipe(
      map((data: any) => {
        //Run something after a request is handled
        //by the request handler before the response is sent
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
