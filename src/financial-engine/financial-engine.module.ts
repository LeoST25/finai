import { Module } from '@nestjs/common';
import { FinancialEngineService } from './financial-engine.service';

@Module({
  providers: [FinancialEngineService],
  exports: [FinancialEngineService],
})
export class FinancialEngineModule {}
