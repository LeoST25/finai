import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappCommandService } from '../whatsapp-command.service';

describe('WhatsappCommandService', () => {
  let service: WhatsappCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsappCommandService],
    }).compile();

    service = module.get<WhatsappCommandService>(WhatsappCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
