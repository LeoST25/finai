import type { Expense } from "@/features/expenses/types/expense";

export type ExpensesSummary = {
  income: number;
  expense: number;
  balance: number;
  transactions: number;
};

export function getExpensesSummary(expenses: Expense[]): ExpensesSummary {
  return expenses.reduce(
    (summary, expense) => {
      if (expense.type === "income") {
        summary.income += expense.value;
      }

      if (expense.type === "expense") {
        summary.expense += expense.value;
      }

      summary.balance = summary.income - summary.expense;
      summary.transactions += 1;

      return summary;
    },
    {
      income: 0,
      expense: 0,
      balance: 0,
      transactions: 0,
    },
  );
}