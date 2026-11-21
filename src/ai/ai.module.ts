import { Module } from '@nestjs/common';
import { ExpensesModule } from '../expenses/expenses.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ExpensesModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
