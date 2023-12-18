import { Controller, Get, Logger } from '@nestjs/common'
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { HealthService } from './health.service'

@ApiSecurity('Api-Key')
@ApiTags('Commons')
@Controller('api/v1/health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name)
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ status: 200, description: 'Service health check ok' })
  getHealth(): string {
    this.logger.log('status: 200')
    return this.healthService.getHealth()
  }
}
