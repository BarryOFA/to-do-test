import {
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import applicationConfig from '../../config/config'
import { firstValueFrom, map, retry } from 'rxjs'
import { ConfigType } from '@nestjs/config'
import { isNotEmptyObject } from 'class-validator'
import { OrganizationDto } from './dto/organization.dto'
import { plainToInstance } from 'class-transformer'

let NAME: string = ''

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
    private readonly httpService: HttpService,
  ) {
    NAME = `[${appConfig.applicationName}]`
  }

  async findOrganization(
    trace: string,
    id: number,
    emailId?: number,
  ): Promise<OrganizationDto> {
    const httpOptions = {
      baseURL: this.appConfig.organizationBaseUrl,
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }

    try {
      const organization = this.httpService
        .get(`${this.appConfig.organizationGetUrl}/${id}`, httpOptions)
        .pipe(
          retry({
            count: +this.appConfig.retries,
            delay: +this.appConfig.retriesDelay,
            resetOnSuccess: true,
          }),
        )

      return await firstValueFrom(
        organization.pipe(
          map((organizationResponse) => {
            if (isNotEmptyObject(organizationResponse.data.data)) {
              const organizationData: OrganizationDto = plainToInstance(
                OrganizationDto,
                organizationResponse.data.data,
                { strategy: 'excludeAll' },
              )

              if (emailId) {
                return this.searchEmail(organizationData, emailId)
              }

              organizationData.emails = undefined
              return organizationData
            } else {
              throw new NotFoundException(
                `${NAME} La organizacion ${id} no existe`,
              )
            }
          }),
        ),
      )
    } catch (error) {
      if (error?.cause && error.cause.code == 'ECONNREFUSED') {
        throw new ServiceUnavailableException(
          `${NAME} El servicio dl-seed-postgresql-orm no se encuentra disponible`,
        )
      } else {
        throw error
      }
    }
  }

  async findAllOrganization(
    trace: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const httpOptions = {
      baseURL: this.appConfig.organizationBaseUrl,
      headers: {
        apiKey: this.appConfig.apiKey,
        trace: trace,
      },
    }

    try {
      const organization = this.httpService
        .get(
          `${this.appConfig.organizationGetAllUrl}?page=${page}&limit=${limit}`,
          httpOptions,
        )
        .pipe(
          retry({
            count: +this.appConfig.retries,
            delay: +this.appConfig.retriesDelay,
            resetOnSuccess: true,
          }),
        )

      let res = await firstValueFrom(organization)
      return res.data
    } catch (error) {
      if (error?.cause && error.cause.code == 'ECONNREFUSED') {
        throw new ServiceUnavailableException(
          `${NAME} El servicio dl-seed-postgres-orm no se encuentra disponible`,
        )
      } else {
        throw error
      }
    }
  }

  private searchEmail(organizationData: OrganizationDto, emailId: number) {
    let email: any
    if (organizationData.emails.length > 0) {
      email = organizationData.emails.find((email) => email.emailId == emailId)
    }

    if (email) {
      organizationData.emails[0] = email
      return organizationData
    }

    throw new NotFoundException(
      `${NAME} El email ${emailId} no existe para la organizacion ${organizationData.organizationId}`,
    )
  }
}
