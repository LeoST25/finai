import { api } from "./api";
import type { Expense, ExpenseType } from "@/features/expenses/types/expense";

export type CreateExpenseInput = {
  description: string;
  category: string;
  value: number;
  type: ExpenseType;
};

export type UpdateExpenseInput = {
  id: string;
  description: string;
  category: string;
  value: number;
  type: ExpenseType;
};

export async function getExpenses(): Promise<Expense[]> {
  const response = await api.get<Expense[]>("/expenses");
  return response.data;
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

export async function deleteExpense(id: string): Promise<Expense> {
  const response = await api.delete<Expense>(`/expenses/${id}`);
  return response.data;
}