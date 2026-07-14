import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum ExpenseType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateExpenseDto {
  @IsString()
  description!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Type(() => Number)
  value!: number;

  @IsEnum(ExpenseType)
  type!: ExpenseType;
}
