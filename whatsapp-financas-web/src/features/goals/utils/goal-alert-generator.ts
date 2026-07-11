import type { FinancialGoalWithProgress } from "@/features/goals/hooks";
import type { GoalAlert } from "@/features/goals/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function createCategoryLimitAlert(
  goal: FinancialGoalWithProgress,
): GoalAlert | null {
  const { percentage, status } = goal.progress;

  if (status === "exceeded") {
    const exceededAmount = goal.currentAmount - goal.targetAmount;

    return {
      id: `${goal.id}-exceeded`,
      goalId: goal.id,
      title: `${goal.title} ultrapassado`,
      description: `Você ultrapassou o limite definido para ${goal.title}. Valor excedente: ${formatCurrency(
        exceededAmount,
      )}.`,
      type: "danger",
      code: "limit-exceeded",
    };
  }

  if (percentage >= 80) {
    return {
      id: `${goal.id}-warning`,
      goalId: goal.id,
      title: `${goal.title} próximo do limite`,
      description: `Você está próximo de atingir o limite definido para ${goal.title}. Valor atual: ${formatCurrency(
        goal.currentAmount,
      )}.`,
      type: "warning",
      code: "near-limit",
    };
  }

  return null;
}

function createSavingsAlert(
  goal: FinancialGoalWithProgress,
): GoalAlert | null {
  const { percentage, remainingAmount, status } = goal.progress;

  if (status === "completed") {
    return {
      id: `${goal.id}-completed`,
      goalId: goal.id,
      title: `${goal.title} concluída`,
      description: `Parabéns! Você concluiu a meta ${goal.title}.`,
      type: "success",
      code: "goal-completed",
    };
  }

  if (percentage >= 80) {
    return {
      id: `${goal.id}-almost-complete`,
      goalId: goal.id,
      title: `${goal.title} está quase concluída`,
      description: `Você está próximo de concluir a meta ${goal.title}. Valor restante: ${formatCurrency(remainingAmount)}.`,
      type: "info",
      code: "near-completion",
    };
  }

  return null;
}

export function generateGoalAlert(
  goal: FinancialGoalWithProgress,
): GoalAlert | null {
  if (goal.type === "category-limit") {
    return createCategoryLimitAlert(goal);
  }

  return createSavingsAlert(goal);
}

export function generateGoalAlerts(
  goals: FinancialGoalWithProgress[],
): GoalAlert[] {
  return goals
    .map(generateGoalAlert)
    .filter((alert): alert is GoalAlert => alert !== null);
}