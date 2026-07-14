export type GoalType = 'savings' | 'expense-limit';

export type GoalStatus =
  'not-started' | 'in-progress' | 'almost-complete' | 'completed' | 'exceeded';

export type FinancialGoal = {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
};

export type GoalProgress = {
  percentage: number;
  remainingAmount: number;
  status: GoalStatus;
  daysRemaining?: number;
};

export type CreateFinancialGoalInput = {
  title: string;
  description?: string;
  category: string;
  type: GoalType;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
};

export type UpdateFinancialGoalInput = Partial<
  Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>
>;

export type UpdateFinancialGoalRequest = 
UpdateFinancialGoalInput & {
  id: string;
}
