import { useMemo, useState } from "react";

import type {
  FinancialGoal,
  GoalProgress,
} from "@/features/goals/types";
import {
  calculateGoalProgress,
  generateGoalAlerts,
} from "@/features/goals/utils";

export type FinancialGoalWithProgress = FinancialGoal & {
  progress: GoalProgress;
};

const initialGoals: FinancialGoal[] = [
  {
    id: "goal-1",
    title: "Reserva de emergência",
    type: "savings",
    targetAmount: 5000,
    currentAmount: 1250,
    deadline: "2026-12-31",
    createdAt: "2026-07-10",
    updatedAt: "2026-07-10",
  },
  {
    id: "goal-2",
    title: "Economia mensal",
    type: "savings",
    targetAmount: 500,
    currentAmount: 320,
    deadline: "2026-07-31",
    createdAt: "2026-07-10",
    updatedAt: "2026-07-10",
  },
  {
    id: "goal-3",
    title: "Limite de alimentação",
    type: "category-limit",
    targetAmount: 800,
    currentAmount: 620,
    category: "Alimentação",
    createdAt: "2026-07-10",
    updatedAt: "2026-07-10",
  },
  {
    id: "goal-4",
    title: "Limite de transporte",
    type: "category-limit",
    targetAmount: 400,
    currentAmount: 430,
    category: "Transporte",
    createdAt: "2026-07-10",
    updatedAt: "2026-07-10",
  },
];

export function useGoals() {
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);

  const goalsWithProgress = useMemo<FinancialGoalWithProgress[]>(
    () =>
      goals.map((goal) => ({
        ...goal,
        progress: calculateGoalProgress(goal),
      })),
    [goals],
  );

  const savingsGoals = useMemo(
    () => goalsWithProgress.filter((goal) => goal.type === "savings"),
    [goalsWithProgress],
  );

  const categoryLimitGoals = useMemo(
    () =>
      goalsWithProgress.filter(
        (goal) => goal.type === "category-limit",
      ),
    [goalsWithProgress],
  );

  const exceededGoals = useMemo(
    () =>
      goalsWithProgress.filter(
        (goal) => goal.progress.status === "exceeded",
      ),
    [goalsWithProgress],
  );

  const almostCompleteGoals = useMemo(
    () =>
      goalsWithProgress.filter(
        (goal) => goal.progress.status === "almost-complete",
      ),
    [goalsWithProgress],
  );

  const alerts = useMemo(
    () => generateGoalAlerts(goalsWithProgress),
    [goalsWithProgress],
  );

  function updateGoalCurrentAmount(id: string, currentAmount: number) {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              currentAmount: Math.max(currentAmount, 0),
              updatedAt: new Date().toISOString(),
            }
          : goal,
      ),
    );
  }

  function resetGoals() {
    setGoals(initialGoals);
  }

  return {
    goals: goalsWithProgress,
    savingsGoals,
    categoryLimitGoals,
    exceededGoals,
    almostCompleteGoals,
    alerts,
    updateGoalCurrentAmount,
    resetGoals,
  };
}