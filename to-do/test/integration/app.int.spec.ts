import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ConfigType } from '@nestjs/config';
import { createMock } from '@golevelup/nestjs-testing';
import applicationConfig from '../../src/config/config';
import { HttpService } from '@nestjs/axios';
import { OrganizationsService } from '../../src/modules/organizations/organizations.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from '../../src/config/winston-logger.config';

let organizationsService: OrganizationsService;
let mockHttpService = createMock<HttpService>();
let mockConfig = createMock<ConfigType<typeof applicationConfig>>();

const mockResultOrganization = {
  trace: "1234",
  code: 200,
  message: "successfull",
  data: {
    organizationId: 1,
    countryId: 1,
    identifierNumber: "",
    businessName: "Razon social",
    order: "Giro",
    current: true,
    recordCreationDate: "2023-10-21",
    recordUpdateDate: "2023-10-21",
    recordCancellationDate: "2999-01-01",
    emails: [{
      emailId: 1,
      email: "juan@gmail.com",
      current: true,
      recordCreationDate: "2023-10-21",
      recordUpdateDate: "2023-10-21",
      recordCancellationDate: "2999-01-01"
    }]
  }
};

const mockResultOrganizationEmpty = {
  trace: "1234",
  code: 200,
  message: "successfull",
  data: {}
};

const mockAxiosOrganizationResponse: AxiosResponse = {
  status: 200, config: undefined, headers: undefined, statusText: '',
  data: mockResultOrganization
}

const mockAxiosOrganizationResponseEmpty: AxiosResponse = {
  status: 200, config: undefined, headers: undefined, statusText: '',
  data: mockResultOrganizationEmpty
}

describe('AppController (int)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    organizationsService = new OrganizationsService(mockConfig, mockHttpService);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
    .setLogger(WinstonModule.createLogger(winstonLoggerConfig))
    .overrideProvider(OrganizationsService)
    .useValue(organizationsService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/v1/organizations (GET) (INTEGRATION)', () => {

    it('Gets the expected data correctly without emails', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));
      return request(app.getHttpServer())
        .get('/api/v1/organizations/1')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(200);
    });

    it('Gets the expected data correctly with emails', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));
      return request(app.getHttpServer())
        .get('/api/v1/organizations/1?emailId=1')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(200);
    });

    it('Throw exception NotFoundException for organization', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponseEmpty));
      return request(app.getHttpServer())
        .get('/api/v1/organizations/1')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(404);
    });

    it('Throw exception NotFoundException for email', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));
      return request(app.getHttpServer())
        .get('/api/v1/organizations/1?emailId=2')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(404);
    });

    it('Throw exception ServiceUnavailableException', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementation(() => {throw new HttpException('description', 400, { cause: {code: "ECONNREFUSED"} })});
      return request(app.getHttpServer())
        .get('/api/v1/organizations/1')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(503);
    });

  });

  describe('/api/v1/organizations (GET) (INTEGRATION) FIND ALL ', () => {

    it('Gets the expected data correctly', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));
      return request(app.getHttpServer())
        .get('/api/v1/organizations')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(200);
    });

    it('Throw exception ServiceUnavailableException', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementation(() => {throw new HttpException('description', 400, { cause: {code: "ECONNREFUSED"} })});
      return request(app.getHttpServer())
        .get('/api/v1/organizations')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(503);
    });

    it('Throw exception InternalErrorServer', () => {
      jest.spyOn(mockHttpService, 'get').mockImplementation(() => {throw new HttpException('description', 400)});
      return request(app.getHttpServer())
        .get('/api/v1/organizations')
        .set('apiKey', 'apiKey')
        .set('trace', '1234')
        .expect(400);
    });
  });
});
