import { OrganizationsService } from '../../src/modules/organizations/organizations.service';
import { HttpService } from '@nestjs/axios';
import { createMock } from '@golevelup/nestjs-testing'
import { ConfigType } from '@nestjs/config';
import applicationConfig from '../../src/config/config';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { HttpException } from '@nestjs/common';

describe('OrganizationsService', () => {
  let organizationsService: OrganizationsService;
  let mockHttpService = createMock<HttpService>();
  let mockConfig = createMock<ConfigType<typeof applicationConfig>>();

  const trace = '1234';

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

  const mockResultEmptyOrganization = {
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
      emails: []
    }
  };

  const mockResultEmail = {
    trace: "1234",
    code: 200,
    message: "successfull",
    data: {
        idCorreoElectronico: 1,
        correo: "juan@gmail.com",
        vigente: true,
        fechaCreacionRegistro: "2023-10-21",
        fechaActualizacionRegistro: "2023-10-21",
        fechaBajaRegistro: "2999-01-01"
    }
  };

  beforeEach(async () => {
    organizationsService = new OrganizationsService(mockConfig, mockHttpService);
  });

  describe('findOrganization()', () => {
    it('should return a Organization and a Email related object', async () => {
      jest.clearAllMocks()

      const mockAxiosOrganizationResponse: AxiosResponse = {
        status: 200, config: undefined, headers: undefined, statusText: '',
        data: mockResultOrganization
      }

      const mockAxiosEmailResponse: AxiosResponse = {
        status: 200, config: undefined, headers: undefined, statusText: '',
        data: mockResultEmail
      }

      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));
      await organizationsService.findOrganization(trace, 1, 1);
      expect(mockHttpService.get).toBeCalledTimes(1);
    });

    it('should throw an exception', async () => {
      jest.clearAllMocks()

      const mockAxiosOrganizationResponse: AxiosResponse = {
        status: 200, config: undefined, headers: undefined, statusText: '',
        data: mockResultEmptyOrganization
      }

      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));

      try {
      await organizationsService.findOrganization(trace, 1, 1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }

      expect(mockHttpService.get).toBeCalledTimes(1);

    });

    it('should return a Organization without email', async () => {
      jest.clearAllMocks()

      const mockAxiosOrganizationResponse: AxiosResponse = {
        status: 200, config: undefined, headers: undefined, statusText: '',
        data: mockResultOrganization
      }

      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));
      await organizationsService.findOrganization(trace, 1, null);
      expect(mockHttpService.get).toBeCalledTimes(1);
    });

    it('should return an empty Organization object', async () => {
      jest.clearAllMocks()

      const mockAxiosOrganizationResponse: AxiosResponse = {
        status: 200, config: undefined, headers: undefined, statusText: '',
        data: mockResultEmptyOrganization
      }

      jest.spyOn(mockHttpService, 'get').mockImplementationOnce(() => of(mockAxiosOrganizationResponse));
      await organizationsService.findOrganization(trace, 1, null);
      expect(mockHttpService.get).toBeCalledTimes(1);
    });
  });
});
