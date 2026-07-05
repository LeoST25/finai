import { Test, TestingModule } from '@nestjs/testing';
import { ReportsSchedulerService } from '../reports-scheduler.service';

describe('ReportsSchedulerService', () => {
  let service: ReportsSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsSchedulerService],
    }).compile();

    service = module.get<ReportsSchedulerService>(ReportsSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
