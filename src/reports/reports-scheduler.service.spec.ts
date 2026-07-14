import { Test, type TestingModule } from '@nestjs/testing';

import { ExpensesService } from '../expenses/expenses.service';
import { ReportsSchedulerService } from './reports-scheduler.service';

describe('ReportsSchedulerService', () => {
  let service: ReportsSchedulerService;

  const expensesServiceMock = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsSchedulerService,
        {
          provide: ExpensesService,
          useValue: expensesServiceMock,
        },
      ],
    }).compile();

    service = module.get<ReportsSchedulerService>(ReportsSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
