import { api } from "./api";
import type { Expense } from "@/features/expenses/types/expense";

export type CreateExpenseInput = {
  description: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
};

export type UpdateExpenseInput = {
  id: string;
  description: string;
  category: string;
  value: number;
  type: 'income' | 'expense';
};

type ExpenseApiResponse = Omit<Expense, 'value'> & {
  value: string | number;
};

function normalizeExpense(expense: ExpenseApiResponse): Expense {
  const numericValue = Number(expense.value);

  return {
    ...expense,
    value: Number.isFinite(numericValue) ? numericValue : 0,
    type: expense.type.toLowerCase() as 'income' | 'expense',
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const response = await api.get<ExpenseApiResponse[]>("/expenses");

  return response.data.map(normalizeExpense);
}

export async function createExpense(data: CreateExpenseInput): Promise<Expense> {
  const response = await api.post<Expense>("/expenses", data);
  return response.data;
}

export async function updateExpense(data: UpdateExpenseInput): Promise<Expense> {
  const { id, ...payload } = data;

  const response = await api.put<Expense>(`/expenses/${id}`, payload);
  return response.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}