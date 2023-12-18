import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import appConfig from './config/config'
import { HealthModule } from './modules/health/health.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TraceMiddleware } from './commons/middleware/trace.middleware'
import { LoggerMiddleware } from './commons/middleware/logger.middleware'
import { ApikeyMiddleware } from './commons/middleware/apikey.middleware'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
        `${process.cwd()}/src/config/env/.env`,
      ],
      expandVariables: true,
      load: [appConfig],
    }),
    {
      ...HttpModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          timeout: configService.get('AXIOS_HTTP_TIMEOUT'),
        }),
        inject: [ConfigService],
      }),
      global: true,
    },
    HealthModule,
    OrganizationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TraceMiddleware, LoggerMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL })
    consumer
      .apply(ApikeyMiddleware)
      .exclude({ path: 'api/v1/health', method: RequestMethod.GET })
      .forRoutes({ path: '/**', method: RequestMethod.ALL })
  }
}
