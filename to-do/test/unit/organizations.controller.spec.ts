import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from '../../src/modules/organizations/organizations.controller';
import { OrganizationsService } from '../../src/modules/organizations/organizations.service';

describe('OrganizationsController', () => {
  let organizationsController: OrganizationsController;
  let organizationsService: OrganizationsService;

  const mockRequest = {
    headers: { trace: '1234', apiKey: 'apikey'},
  };

  const mockResult = {
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: {
            findOrganization: jest.fn().mockResolvedValue(
              mockResult
            ),
          },
        },
      ],
    }).compile();

    organizationsController = module.get<OrganizationsController>(OrganizationsController);
    organizationsService = module.get<OrganizationsService>(OrganizationsService);
  });

  describe('findOrganization', () => {
    it('should return an organization', async () => {

      jest.spyOn(organizationsService, 'findOrganization').mockResolvedValue(mockResult);

      // Call the controller method
      await organizationsController.findOrganization(mockRequest, 1, 1);

      // Assertions
      expect(organizationsService.findOrganization).toHaveBeenCalledWith('1234', 1, 1);
    });

    it('should return a message if no data is found', async () => {
      // Mock the service's findOrganization method to return null or an empty object
      jest.spyOn(organizationsService, 'findOrganization').mockResolvedValue(null);

      // Call the controller method
      await organizationsController.findOrganization(mockRequest, 1, null);

      // Assertions
      expect(organizationsService.findOrganization).toHaveBeenCalledWith('1234', 1, null);
    });
  });
});
