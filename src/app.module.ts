import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { ExpensesModule } from './expenses/expenses.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ReportsModule } from './reports/reports.module';
import { HealthModule } from './health/health.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    HealthModule,
    ExpensesModule,
    WhatsappModule,
    ReportsModule,
    AiModule,
  ],
})
export class AppModule {}
