import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ExpensesService } from '../expenses/expenses.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ExpensesService, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
