import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsSchedulerService } from './reports-scheduler.service';
import { ExpensesModule } from '../expenses/expenses.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [ExpensesModule, WhatsappModule],
  providers: [ReportsService, ReportsSchedulerService],
})
export class ReportsModule {}