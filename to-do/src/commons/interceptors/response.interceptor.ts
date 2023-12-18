import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { SuccessResponse } from '../interfaces/success-response.interface'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const traceValue = request.headers.trace

    return next.handle().pipe(
      map((data: any) => {
        let value = undefined
        if (data?.items) {
          value = data.items
        } else if (data?.data) {
          value = data.data
        } else {
          value = data
        }

        let pagination = undefined
        if (data?.meta) {
          pagination = data.meta
        } else if (data?.pagination) {
          pagination = data.pagination
        }

        return {
          trace: traceValue,
          code: response.statusCode,
          message: 'successfull',
          data: value,
          pagination: pagination,
        }
      }),
    )
  }
}
