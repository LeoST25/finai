import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { ExpensesService } from '../expenses/expenses.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: ExpensesService, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
