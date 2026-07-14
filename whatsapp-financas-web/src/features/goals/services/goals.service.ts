import { api } from '@/features/expenses/services/api';

import type {
  CreateFinancialGoalInput,
  FinancialGoal,
  GoalType,
  UpdateFinancialGoalRequest,
} from '@/features/goals/types';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

type GoalApiResponse = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  type: string;
  targetAmount: number | string;
  currentAmount: number | string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
};

function normalizeGoalType(type: string): GoalType {
  if (type === 'savings') {
    return 'savings';
  }

  if (type === 'expense-limit') {
    return 'expense-limit';
  }

  throw new Error(`Tipo de meta desconhecido: ${type}`);
}

function normalizeAmount(value: number | string): number {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return numericValue;
}

function normalizeGoal(goal: GoalApiResponse): FinancialGoal {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description ?? undefined,
    category: goal.category,
    type: normalizeGoalType(goal.type),
    targetAmount: normalizeAmount(goal.targetAmount),
    currentAmount: normalizeAmount(goal.currentAmount),
    deadline: goal.deadline ?? undefined,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}

export async function getGoals(): Promise<FinancialGoal[]> {
  const response = await api.get<ApiResponse<GoalApiResponse[]>>('/goals');

  return response.data.data.map(normalizeGoal);
}

export async function getGoalById(id: string): Promise<FinancialGoal> {
  const response = await api.get<ApiResponse<GoalApiResponse>>(`/goals/${id}`);

  return normalizeGoal(response.data.data);
}

export async function createGoal(
  input: CreateFinancialGoalInput,
): Promise<FinancialGoal> {
  const response = await api.post<ApiResponse<GoalApiResponse>>(
    '/goals',
    input,
  );

  return normalizeGoal(response.data.data);
}

export async function updateGoal(
  input: UpdateFinancialGoalRequest,
): Promise<FinancialGoal> {
  const { id, ...payload } = input;

  const response = await api.patch<ApiResponse<GoalApiResponse>>(
    `/goals/${id}`,
    payload,
  );

  return normalizeGoal(response.data.data);
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`);
}
