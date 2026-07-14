import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ExpensesModule } from '../expenses/expenses.module';
import { WhatsappCommandService } from './whatsapp-command.service';

@Module({
  imports: [ExpensesModule],
  providers: [WhatsappService, WhatsappCommandService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
