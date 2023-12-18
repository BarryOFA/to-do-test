import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import appConfig from './config/config'
import { WinstonModule } from 'nest-winston'
import { ConfigType } from '@nestjs/config'
import { winstonLoggerConfig } from './config/winston-logger.config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ExceptionFilter } from './commons/filters/exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerConfig),
  })

  const appEnv: ConfigType<typeof appConfig> = app.get(appConfig.KEY)

  /**
   * ===========================
   * Setup Swagger Documentation
   * ===========================
   **/
  if (appEnv.nodeEnv !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Vida Camara Api')
      .setDescription('Vida Camara API Description')
      .setVersion('1.1')
      .addTag('Organizacion')
      .addTag('Commons')
      .addApiKey({ type: 'apiKey', name: 'apiKey', in: 'header' }, 'Api-Key')
      .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, document)
  }

  app.useGlobalFilters(new ExceptionFilter(app.get(HttpAdapterHost)))
  app.useGlobalPipes(new ValidationPipe())
  const logger = new Logger('bootstrap')
  const PORT = appEnv.port
  await app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`)
  })
}
bootstrap()
