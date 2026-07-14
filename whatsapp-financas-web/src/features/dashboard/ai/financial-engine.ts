import type { Expense } from '@/features/expenses/types/expense';
import type { FinancialGoal } from '@/features/goals/types';
import { calculateFinancialMetrics } from './financial-metrics';
import type { FinancialMetrics } from './types';

export type FinancialEngineSnapshot = {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
  cashFlow: {
    currentMonthExpenses: number;
    previousMonthExpenses: number;
    projectedExpenses: number;
    recentExpenseTotal: number;
    recentExpenseCount: number;
  };
  savingsGoals: FinancialGoal[];
  limits: FinancialGoal[];
  patrimony: number;
  metrics: FinancialMetrics;
};

export class FinancialEngine {
  static create(
    expenses: Expense[],
    goals: FinancialGoal[] = [],
  ): FinancialEngineSnapshot {
    const metrics = calculateFinancialMetrics(expenses);
    const savingsGoals = goals.filter((goal) => goal.type === 'savings');
    const limits = goals.filter((goal) => goal.type === 'expense-limit');

    return {
      balance: metrics.balance,
      income: metrics.totalIncome,
      expenses: metrics.totalExpenses,
      savingsRate: metrics.savingsRate,
      cashFlow: {
        currentMonthExpenses: metrics.currentMonthTotal,
        previousMonthExpenses: metrics.previousMonthTotal,
        projectedExpenses: metrics.projectedExpenses,
        recentExpenseTotal: metrics.recentExpenseTotal,
        recentExpenseCount: metrics.recentExpenseCount,
      },
      savingsGoals,
      limits,
      patrimony:
        metrics.totalIncome -
        metrics.totalExpenses +
        savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0),
      metrics,
    };
  }
}
