import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalType, type FinancialGoal } from '@prisma/client';
import { GoalTypeDto, CreateGoalDto } from './dto/create-goal.dto';

import { PrismaService } from '../prisma/prisma.service';
import type { UpdateGoalDto } from './dto/update-goal.dto';

export type FinancialGoalResponse = Omit<
  FinancialGoal,
  'targetAmount' | 'currentAmount' | 'type'
> & {
  type: 'savings' | 'expense-limit';
  targetAmount: number;
  currentAmount: number;
};

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGoalDto: CreateGoalDto): Promise<FinancialGoalResponse> {
    const goal = await this.prisma.financialGoal.create({
      data: {
        title: createGoalDto.title,
        description: createGoalDto.description,
        category: createGoalDto.category,
        type: this.toPrismaGoalType(createGoalDto.type),
        targetAmount: createGoalDto.targetAmount,
        currentAmount: createGoalDto.currentAmount ?? 0,
        deadline: createGoalDto.deadline
          ? new Date(createGoalDto.deadline)
          : null,
      },
    });

    return this.toResponse(goal);
  }

  async findAll(): Promise<FinancialGoalResponse[]> {
    const goals = await this.prisma.financialGoal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return goals.map((goal) => this.toResponse(goal));
  }

  async findOne(id: string): Promise<FinancialGoalResponse> {
    const goal = await this.prisma.financialGoal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Meta financeira ${id} não encontrada.`);
    }

    return this.toResponse(goal);
  }

  async update(
    id: string,
    updateGoalDto: UpdateGoalDto,
  ): Promise<FinancialGoalResponse> {
    await this.ensureGoalExists(id);

    const goal = await this.prisma.financialGoal.update({
      where: { id },
      data: {
        title: updateGoalDto.title,
        description: updateGoalDto.description,
        category: updateGoalDto.category,
        type: updateGoalDto.type
          ? this.toPrismaGoalType(updateGoalDto.type)
          : undefined,
        targetAmount: updateGoalDto.targetAmount,
        currentAmount: updateGoalDto.currentAmount,
        deadline:
          updateGoalDto.deadline === undefined
            ? undefined
            : updateGoalDto.deadline
              ? new Date(updateGoalDto.deadline)
              : null,
      },
    });

    return this.toResponse(goal);
  }

  async remove(id: string): Promise<FinancialGoalResponse> {
    await this.ensureGoalExists(id);

    const goal = await this.prisma.financialGoal.delete({
      where: { id },
    });

    return this.toResponse(goal);
  }
  private async ensureGoalExists(id: string): Promise<void> {
    const goal = await this.prisma.financialGoal.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!goal) {
      throw new NotFoundException(`Meta financeira ${id} não encontrada.`);
    }
  }

  private toPrismaGoalType(type: GoalTypeDto): GoalType {
    const goalTypeMap: Record<GoalTypeDto, GoalType> = {
      [GoalTypeDto.SAVINGS]: GoalType.SAVINGS,
      [GoalTypeDto.EXPENSE_LIMIT]: GoalType.EXPENSE_LIMIT,
    };

    return goalTypeMap[type];
  }

  private toResponse(goal: FinancialGoal): FinancialGoalResponse {
    return {
      ...goal,
      type: goal.type === GoalType.SAVINGS ? 'savings' : 'expense-limit',
      targetAmount: Number(goal.targetAmount),
      currentAmount: Number(goal.currentAmount),
    };
  }
}
