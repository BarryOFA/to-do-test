import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

@ApiSecurity('Api-Key')
@ApiTags('Organizacion')
@Controller('api/v1/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get(':id')
  async findOrganization(
    @Req() req,
    @Param('id') id: number,
    @Query('emailId') emailId: number,
  ) {
    return await this.organizationsService.findOrganization(
      req.headers.trace,
      id,
      emailId,
    )
  }

  @Get()
  async findAllOrganization(
    @Req() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.organizationsService.findAllOrganization(
      req.headers.trace,
      page,
      limit,
    )
  }
}
