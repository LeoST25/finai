import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum GoalTypeDto {
  SAVINGS = 'savings',
  EXPENSE_LIMIT = 'expense-limit',
}

export class CreateGoalDto {
  @IsString({
    message: 'O título deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'O título é obrigatório.',
  })
  @MaxLength(100, {
    message: 'O título deve ter no máximo 100 caracteres.',
  })
  title: string;

  @IsOptional()
  @IsString({
    message: 'A descrição deve ser um texto.',
  })
  @MaxLength(500, {
    message: 'A descrição deve ter no máximo 500 caracteres.',
  })
  description?: string;

  @IsString({
    message: 'A categoria deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'A categoria é obrigatória.',
  })
  @MaxLength(50, {
    message: 'A categoria deve ter no máximo 50 caracteres.',
  })
  category: string;

  @IsEnum(GoalTypeDto, {
    message: 'O tipo deve ser savings ou expense-limit.',
  })
  type: GoalTypeDto;

  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    {
      message: 'O valor da meta deve ser um número válido.',
    },
  )
  @Min(0.01, {
    message: 'O valor da meta deve ser maior que zero.',
  })
  targetAmount: number;

  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    {
      message: 'O valor atual deve ser um número válido.',
    },
  )
  @Min(0, {
    message: 'O valor atual não pode ser negativo.',
  })
  currentAmount?: number;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'O prazo deve ser uma data válida no formato ISO.',
    },
  )
  deadline?: string;
}
