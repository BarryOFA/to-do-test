import { EmailDto } from './email.dto'
import { Expose, Type } from 'class-transformer'

export class OrganizationDto {
  @Expose()
  organizationId: number

  @Expose()
  countryId: number

  @Expose()
  identifierNumber: string

  @Expose()
  businessName: string

  @Expose()
  order: string

  @Expose()
  current: boolean

  @Expose()
  recordCreationDate: string

  @Expose()
  recordUpdateDate: string

  @Expose()
  recordCancellationDate: string

  @Expose()
  @Type(() => EmailDto)
  emails?: EmailDto[]
}
