export type GoalType = "savings" | "category-limit";

export type GoalStatus =
  | "not-started"
  | "in-progress"
  | "almost-complete"
  | "completed"
  | "exceeded";

export type FinancialGoal = {
  id: string;
  title: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  category?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GoalProgress = {
  percentage: number;
  remainingAmount: number;
  status: GoalStatus;
  daysRemaining?: number;
};

export type CreateFinancialGoalInput = {
  title: string;
  type: GoalType;
  targetAmount: number;
  category?: string;
  deadline?: string;
};

export type UpdateFinancialGoalInput = Partial<
  Omit<FinancialGoal, "id" | "createdAt" | "updatedAt">
>;