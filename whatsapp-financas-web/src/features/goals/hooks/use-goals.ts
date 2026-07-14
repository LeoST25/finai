import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getGoals } from '@/features/goals/services/goals.service';

import type { FinancialGoal, GoalProgress } from '@/features/goals/types';

import {
  calculateGoalProgress,
  generateGoalAlerts,
} from '@/features/goals/utils';

export type FinancialGoalWithProgress = FinancialGoal & {
  progress: GoalProgress;
};

export function useGoals() {
  const {
    data: goals = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  const goalsWithProgress = useMemo<FinancialGoalWithProgress[]>(
    () =>
      goals.map((goal) => ({
        ...goal,
        progress: calculateGoalProgress(goal),
      })),
    [goals],
  );

  const savingsGoals = useMemo(
    () => goalsWithProgress.filter((goal) => goal.type === 'savings'),
    [goalsWithProgress],
  );

  const expenseLimitGoals = useMemo(
    () => goalsWithProgress.filter((goal) => goal.type === 'expense-limit'),
    [goalsWithProgress],
  );

  const exceededGoals = useMemo(
    () =>
      goalsWithProgress.filter((goal) => goal.progress.status === 'exceeded'),
    [goalsWithProgress],
  );

  const almostCompleteGoals = useMemo(
    () =>
      goalsWithProgress.filter(
        (goal) => goal.progress.status === 'almost-complete',
      ),
    [goalsWithProgress],
  );

  const alerts = useMemo(
    () => generateGoalAlerts(goalsWithProgress),
    [goalsWithProgress],
  );

  return {
    goals: goalsWithProgress,
    savingsGoals,
    expenseLimitGoals,
    exceededGoals,
    almostCompleteGoals,
    alerts,

    isLoading,
    isError,
    error,
  };
}
