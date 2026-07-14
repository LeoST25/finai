import type {
  FinancialGoal,
  GoalProgress,
  GoalStatus,
} from "@/features/goals/types";

function calculatePercentage(currentAmount: number, targetAmount: number) {
  if (targetAmount <= 0) {
    return 0;
  }

  return Math.round((currentAmount / targetAmount) * 100);
}

function calculateRemainingAmount(
  currentAmount: number,
  targetAmount: number,
) {
  return Math.max(targetAmount - currentAmount, 0);
}

function calculateDaysRemaining(deadline?: string) {
  if (!deadline) {
    return undefined;
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return undefined;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const difference = deadlineDate.getTime() - today.getTime();

  return Math.max(Math.ceil(difference / millisecondsPerDay), 0);
}

function getSavingsGoalStatus(percentage: number): GoalStatus {
  if (percentage >= 100) {
    return "completed";
  }

  if (percentage >= 80) {
    return "almost-complete";
  }

  if (percentage >= 1) {
    return "in-progress";
  }

  return "not-started";
}

function getCategoryLimitStatus(percentage: number): GoalStatus {
  if (percentage > 100) {
    return "exceeded";
  }

  if (percentage >= 100) {
    return "completed";
  }

  if (percentage >= 80) {
    return "almost-complete";
  }

  if (percentage >= 1) {
    return "in-progress";
  }

  return "not-started";
}

function getGoalStatus(goal: FinancialGoal, percentage: number) {
  if (goal.type === "expense-limit") {
    return getCategoryLimitStatus(percentage);
  }

  return getSavingsGoalStatus(percentage);
}

export function calculateGoalProgress(
  goal: FinancialGoal,
): GoalProgress {
  const percentage = calculatePercentage(
    goal.currentAmount,
    goal.targetAmount,
  );

  return {
    percentage,
    remainingAmount: calculateRemainingAmount(
      goal.currentAmount,
      goal.targetAmount,
    ),
    status: getGoalStatus(goal, percentage),
    daysRemaining: calculateDaysRemaining(goal.deadline),
  };
}