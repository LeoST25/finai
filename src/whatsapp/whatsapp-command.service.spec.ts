import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappCommandService } from './whatsapp-command.service';
import { ExpensesService } from '../expenses/expenses.service';

describe('WhatsappCommandService', () => {
  let service: WhatsappCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappCommandService,
        { provide: ExpensesService, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    service = module.get<WhatsappCommandService>(WhatsappCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
