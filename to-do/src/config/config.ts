import { registerAs } from '@nestjs/config'

const { env } = process

export default registerAs('app', () => ({
  applicationName: env.APPLICATION_NAME,
  nodeEnv: env.NODE_ENV || 'development',
  port: env.PORT || 3005,
  apiKey: env.API_KEY,
  httpTimeout: env.AXIOS_HTTP_TIMEOUT,
  retries: env.AXIOS_RETRIES,
  retriesDelay: env.AXIOS_DELAY_BETWEEN_RETRIES,
  organizationBaseUrl: env.ORGANIZATION_BASE_URL,
  organizationGetUrl: env.ORGANIZATION_GET,
  organizationEmailGetUrl: env.ORGANIZATION_EMAIL_GET,
  organizationGetAllUrl: env.ORGANIZATION_GET_ALL,
}))
