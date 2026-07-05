import type { Expense } from "@/features/expenses/types/expense";

export function getDashboardSummary(expenses: Expense[]) {
  const income = expenses
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.value, 0);

  const expense = expenses
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.value, 0);

  return {
    income,
    expense,
    balance: income - expense,
    transactions: expenses.length,
  };
}