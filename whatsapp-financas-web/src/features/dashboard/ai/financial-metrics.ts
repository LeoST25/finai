import type { Expense } from '@/features/expenses/types/expense';
import type { FinancialMetrics } from './types';

function normalizeValue(value: unknown): number {
  const numericValue =
    typeof value === 'string' ? Number(value.replace(',', '.')) : Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function normalizeType(type: unknown): string {
  return String(type).trim().toLowerCase();
}

function getExpenseDate(expense: Expense): Date {
  const expenseWithLegacyDate = expense as Expense & {
    date?: string | Date;
  }

  return new Date(
    expense.createdAt ?? expenseWithLegacyDate.date ?? new Date(),
  );
}

function isSameMonth(date: Date, referenceDate: Date): boolean {
  return (
    date.getMonth() === referenceDate.getMonth() &&
    date.getFullYear() === referenceDate.getFullYear()
  );
}

function isPreviousMonth(date: Date, referenceDate: Date): boolean {
  const previousMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() - 1,
    1,
  );

  return (
    date.getMonth() === previousMonth.getMonth() &&
    date.getFullYear() === previousMonth.getFullYear()
  );
}

export function calculateFinancialMetrics(
  expenses: Expense[],
): FinancialMetrics {
  const now = new Date();

  const totalIncome = expenses
    .filter((expense) => normalizeType(expense.type) === 'income')
    .reduce((total, expense) => total + normalizeValue(expense.value), 0);

  const totalExpenses = expenses
    .filter((expense) => normalizeType(expense.type) === 'expense')
    .reduce((total, expense) => total + normalizeValue(expense.value), 0);

  const currentMonthTotal = expenses
    .filter((expense) => {
      const date = getExpenseDate(expense);

      return (
        normalizeType(expense.type) === 'expense' && isSameMonth(date, now)
      );
    })
    .reduce((total, expense) => total + normalizeValue(expense.value), 0);

  const previousMonthTotal = expenses
    .filter((expense) => {
      const date = getExpenseDate(expense);

      return (
        normalizeType(expense.type) === 'expense' && isPreviousMonth(date, now)
      );
    })
    .reduce((total, expense) => total + normalizeValue(expense.value), 0);

  const balance = totalIncome - totalExpenses;

  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const currentDay = now.getDate();

  const daysInCurrentMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  const projectedExpenses =
    currentDay > 0
      ? (currentMonthTotal / currentDay) * daysInCurrentMonth
      : currentMonthTotal;

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    currentMonthTotal,
    previousMonthTotal,
    projectedExpenses,
  };
}
