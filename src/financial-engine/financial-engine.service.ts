import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { FinancialGoal } from '@prisma/client';

export type CategoryTotal = {
  name: string;
  total: number;
};

export type CashFlow = {
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  projectedExpenses: number;
  recentExpenseTotal: number;
  recentExpenseCount: number;
};

export type FinancialMetrics = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  currentMonthTotal: number;
  previousMonthTotal: number;
  projectedExpenses: number;
  recentExpenseTotal: number;
  recentExpenseCount: number;
  topCategory: CategoryTotal | undefined;
};

export type SavingsGoalSummary = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  deadline: Date | null;
};

export type LimitGoalSummary = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
};

export type FinancialEngineSnapshot = {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  cashFlow: CashFlow;
  metrics: FinancialMetrics;
  savingsGoals: SavingsGoalSummary[];
  limits: LimitGoalSummary[];
  patrimony: number;
  topCategory: CategoryTotal | undefined;
};

@Injectable()
export class FinancialEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async buildSnapshot(): Promise<FinancialEngineSnapshot> {
    const [expenses, goals] = await Promise.all([
      this.prisma.expense.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.financialGoal.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const metrics = this.calculateMetrics(expenses);
    const savingsGoals = goals
      .filter((g) => g.type === 'SAVINGS')
      .map((g) => this.toSavingsSummary(g));
    const limits = goals
      .filter((g) => g.type === 'EXPENSE_LIMIT')
      .map((g) => this.toLimitSummary(g));

    const patrimony =
      metrics.totalIncome -
      metrics.totalExpenses +
      goals
        .filter((g) => g.type === 'SAVINGS')
        .reduce((sum, g) => sum + Number(g.currentAmount), 0);

    return {
      balance: metrics.balance,
      totalIncome: metrics.totalIncome,
      totalExpenses: metrics.totalExpenses,
      savingsRate: metrics.savingsRate,
      cashFlow: {
        currentMonthExpenses: metrics.currentMonthTotal,
        previousMonthExpenses: metrics.previousMonthTotal,
        projectedExpenses: metrics.projectedExpenses,
        recentExpenseTotal: metrics.recentExpenseTotal,
        recentExpenseCount: metrics.recentExpenseCount,
      },
      metrics,
      savingsGoals,
      limits,
      patrimony,
      topCategory: metrics.topCategory,
    };
  }

  private calculateMetrics(
    expenses: Array<{
      value: { toNumber?: () => number } | number | string;
      type: string;
      category: string;
      createdAt: Date;
    }>,
  ): FinancialMetrics {
    const now = new Date();

    const toNumber = (val: unknown): number => {
      if (val && typeof val === 'object' && 'toNumber' in val) {
        return (val as { toNumber: () => number }).toNumber();
      }
      const n = Number(val);
      return Number.isFinite(n) ? n : 0;
    };

    const incomeType = 'income' as const;
    const expenseType = 'expense' as const;

    const totalIncome = expenses
      .filter((e) => e.type === incomeType)
      .reduce((sum, e) => sum + toNumber(e.value), 0);

    const totalExpenses = expenses
      .filter((e) => e.type === expenseType)
      .reduce((sum, e) => sum + toNumber(e.value), 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    const isSameMonth = (date: Date) =>
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const isPreviousMonth = (date: Date) => {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        date.getMonth() === prev.getMonth() &&
        date.getFullYear() === prev.getFullYear()
      );
    };

    const isRecent = (date: Date) => {
      const windowStart = new Date(now);
      windowStart.setDate(windowStart.getDate() - 7);
      return date >= windowStart && date <= now;
    };

    const currentMonthTotal = expenses
      .filter((e) => e.type === expenseType && isSameMonth(e.createdAt))
      .reduce((sum, e) => sum + toNumber(e.value), 0);

    const previousMonthTotal = expenses
      .filter((e) => e.type === expenseType && isPreviousMonth(e.createdAt))
      .reduce((sum, e) => sum + toNumber(e.value), 0);

    const currentDay = now.getDate();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const projectedExpenses =
      currentDay > 0
        ? (currentMonthTotal / currentDay) * daysInMonth
        : currentMonthTotal;

    const recentExpenses = expenses.filter(
      (e) => e.type === expenseType && isRecent(e.createdAt),
    );
    const recentExpenseTotal = recentExpenses.reduce(
      (sum, e) => sum + toNumber(e.value),
      0,
    );
    const recentExpenseCount = recentExpenses.length;

    const categoryMap = new Map<string, number>();
    for (const expense of expenses) {
      if (expense.type !== expenseType) continue;
      const cat = expense.category || 'Outros';
      categoryMap.set(
        cat,
        (categoryMap.get(cat) ?? 0) + toNumber(expense.value),
      );
    }

    const topCategory = [...categoryMap.entries()].sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      currentMonthTotal,
      previousMonthTotal,
      projectedExpenses,
      recentExpenseTotal,
      recentExpenseCount,
      topCategory: topCategory
        ? { name: topCategory[0], total: topCategory[1] }
        : undefined,
    };
  }

  private toSavingsSummary(goal: FinancialGoal): SavingsGoalSummary {
    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetAmount: Number(goal.targetAmount),
      currentAmount: Number(goal.currentAmount),
      progress:
        Number(goal.targetAmount) > 0
          ? (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
          : 0,
      deadline: goal.deadline,
    };
  }

  private toLimitSummary(goal: FinancialGoal): LimitGoalSummary {
    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetAmount: Number(goal.targetAmount),
      currentAmount: Number(goal.currentAmount),
      deadline: goal.deadline,
    };
  }
}
