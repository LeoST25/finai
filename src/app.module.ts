import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { ExpensesModule } from './expenses/expenses.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ReportsModule } from './reports/reports.module';
import { HealthModule } from './health/health.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    HealthModule,
    ExpensesModule,
    WhatsappModule,
    ReportsModule,
    GoalsModule,
  ],
})
export class AppModule {}
