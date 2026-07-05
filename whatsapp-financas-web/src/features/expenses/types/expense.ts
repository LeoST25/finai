export type ExpenseType = "income" | "expense";

export type Expense = {
  id: string;
  description: string;
  category: string;
  value: number;
  type: ExpenseType;
  createdAt: string;
};