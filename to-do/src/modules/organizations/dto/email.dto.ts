import { Expose } from 'class-transformer'

export class EmailDto {
  @Expose()
  emailId: number

  @Expose()
  email: string

  @Expose()
  current: boolean

  recordCreationDate: string

  recordUpdateDate: string

  recordCancellationDate: string
}
