export type ExpenseType = "income" | "expense";

export interface Expense {
  id: string;
  description: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
  createdAt: string;
};