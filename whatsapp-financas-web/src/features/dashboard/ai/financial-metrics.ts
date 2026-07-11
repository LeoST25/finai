import type { Expense } from "@/features/expenses/types/expense";
import type { FinancialMetrics } from "@/features/dashboard/ai/types";

function getAmount(expense: Expense) {
  return Number(expense.value ?? 0);
}

function isIncome(expense: Expense) {
  return expense.type === "income";
}

function isExpense(expense: Expense) {
  return expense.type === "expense";
}

function getExpenseDate(expense: Expense) {
  const record = expense as Expense & {
    date?: string | Date;
    createdAt?: string | Date;
  };

  return record.date ?? record.createdAt ?? new Date();
}

function isSameMonth(date: Date, reference: Date) {
  return (
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear()
  );
}

function isPreviousMonth(date: Date, reference: Date) {
  const previousMonth = new Date(reference);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  return (
    date.getMonth() === previousMonth.getMonth() &&
    date.getFullYear() === previousMonth.getFullYear()
  );
}

export function calculateFinancialMetrics(
  expenses: Expense[],
): FinancialMetrics {
  const now = new Date();

  const income = expenses
    .filter(isIncome)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const totalExpenses = expenses
    .filter(isExpense)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const balance = income - totalExpenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  const currentMonthExpenses = expenses.filter((expense) =>
    isSameMonth(new Date(getExpenseDate(expense)), now),
  );

  const previousMonthExpenses = expenses.filter((expense) =>
    isPreviousMonth(new Date(getExpenseDate(expense)), now),
  );

  const currentMonthTotal = currentMonthExpenses
    .filter(isExpense)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const previousMonthTotal = previousMonthExpenses
    .filter(isExpense)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const expensesByCategory = expenses.filter(isExpense).reduce(
    (acc, expense) => {
      const category = expense.category || "Sem categoria";
      acc[category] = (acc[category] ?? 0) + getAmount(expense);
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategoryEntry = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const today = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  const projectedExpenses =
    today > 0 && currentMonthTotal > 0
      ? (currentMonthTotal / today) * daysInMonth
      : 0;

  return {
    income,
    totalExpenses,
    balance,
    savingsRate,
    currentMonthTotal,
    previousMonthTotal,
    projectedExpenses,
    topCategory: topCategoryEntry
      ? {
          name: topCategoryEntry[0],
          total: topCategoryEntry[1],
        }
      : undefined,
  };
}