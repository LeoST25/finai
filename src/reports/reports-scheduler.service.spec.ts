import { Test, TestingModule } from '@nestjs/testing';
import { ReportsSchedulerService } from './reports-scheduler.service';
import { ReportsService } from './reports.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

jest.mock('@whiskeysockets/baileys', () => ({
  __esModule: true,
  default: jest.fn(),
  DisconnectReason: { loggedOut: 401 },
  useMultiFileAuthState: jest.fn(),
}));

describe('ReportsSchedulerService', () => {
  let service: ReportsSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsSchedulerService,
        { provide: ReportsService, useValue: {} },
        {
          provide: WhatsappService,
          useValue: { isEnabled: false, sendMessage: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ReportsSchedulerService>(ReportsSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
