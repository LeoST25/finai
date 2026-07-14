import { Test, type TestingModule } from '@nestjs/testing';

import { ExpensesService } from '../expenses/expenses.service';
import { WhatsappCommandService } from './whatsapp-command.service';

describe('WhatsappCommandService', () => {
  let service: WhatsappCommandService;

  const expensesServiceMock = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappCommandService,
        {
          provide: ExpensesService,
          useValue: expensesServiceMock,
        },
      ],
    }).compile();

    service = module.get<WhatsappCommandService>(WhatsappCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
