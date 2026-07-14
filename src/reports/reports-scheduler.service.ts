import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportsService } from './reports.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class ReportsSchedulerService {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly whatsappService: WhatsappService,
  ) {}

  @Cron('0 20 * * *')
  async handleDailySummary() {
    console.log('📊 Gerando resumo diário...');

    const summary = await this.reportsService.generateDailySummary();

    if (!summary) {
      console.log('📭 Nenhum gasto registrado hoje.');
      return;
    }

    const chatId = process.env.ADMIN_NUMBER + '@s.whatsapp.net';

    await this.whatsappService.sendMessage(chatId, summary);

    console.log('✅ Resumo diário enviado.');
  }
}
