import type { FinancialGoalWithProgress } from "@/features/goals/hooks";
import type {
  FinancialInsight,
  FinancialRecommendation,
} from "@/features/dashboard/ai/financial-analyzer";

type GoalAnalysisResult = {
  insights: FinancialInsight[];
  recommendations: FinancialRecommendation[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function analyzeSavingsGoal(
  goal: FinancialGoalWithProgress,
  result: GoalAnalysisResult,
) {
  const { percentage, remainingAmount, status, daysRemaining } =
    goal.progress;

  if (status === "completed") {
    result.insights.push({
      title: `Meta concluída: ${goal.title}`,
      description: `Você atingiu ${percentage}% dessa meta financeira.`,
      type: "success",
    });

    result.recommendations.push({
      title: "Defina um novo objetivo",
      description: `A meta "${goal.title}" foi concluída. Considere aumentar o objetivo ou criar uma nova meta.`,
    });

    return;
  }

  if (status === "almost-complete") {
    result.insights.push({
      title: `${goal.title} está quase concluída`,
      description: `Você já atingiu ${percentage}% da meta. Faltam ${formatCurrency(
        remainingAmount,
      )}.`,
      type: "success",
    });
  }

  if (
    daysRemaining !== undefined &&
    daysRemaining > 0 &&
    remainingAmount > 0
  ) {
    const dailyAmount = remainingAmount / daysRemaining;

    result.recommendations.push({
      title: `Plano para ${goal.title}`,
      description: `Reserve aproximadamente ${formatCurrency(
        dailyAmount,
      )} por dia para atingir essa meta no prazo.`,
      estimatedImpact: formatCurrency(remainingAmount),
    });
  }

  if (daysRemaining === 0) {
    result.insights.push({
      title: `Prazo encerrado: ${goal.title}`,
      description: `A meta encerrou com ${percentage}% de progresso.`,
      type: "warning",
    });

    result.recommendations.push({
      title: "Revise o prazo da meta",
      description: `A meta "${goal.title}" ainda precisa de ${formatCurrency(
        remainingAmount,
      )}. Atualize o prazo ou ajuste o valor desejado.`,
    });
  }
}

function analyzeCategoryLimit(
  goal: FinancialGoalWithProgress,
  result: GoalAnalysisResult,
) {
  const { percentage, status, remainingAmount } = goal.progress;
  const category = goal.category ?? goal.title;

  if (status === "exceeded") {
    const exceededAmount = goal.currentAmount - goal.targetAmount;

    result.insights.push({
      title: `Limite ultrapassado em ${category}`,
      description: `Você gastou ${formatCurrency(
        exceededAmount,
      )} acima do limite definido.`,
      type: "danger",
    });

    result.recommendations.push({
      title: `Reduza gastos em ${category}`,
      description: `Evite novos gastos nessa categoria até o próximo período e revise os lançamentos recentes.`,
      estimatedImpact: formatCurrency(exceededAmount),
    });

    return;
  }

  if (percentage >= 80) {
    result.insights.push({
      title: `${category} próximo do limite`,
      description: `Você já utilizou ${percentage}% do limite dessa categoria.`,
      type: "warning",
    });

    result.recommendations.push({
      title: `Controle os próximos gastos em ${category}`,
      description: `Restam apenas ${formatCurrency(
        remainingAmount,
      )} antes de atingir o limite.`,
      estimatedImpact: formatCurrency(remainingAmount),
    });
  }
}

export function analyzeFinancialGoals(
  goals: FinancialGoalWithProgress[],
): GoalAnalysisResult {
  const result: GoalAnalysisResult = {
    insights: [],
    recommendations: [],
  };

  goals.forEach((goal) => {
    if (goal.type === "savings") {
      analyzeSavingsGoal(goal, result);
      return;
    }

    analyzeCategoryLimit(goal, result);
  });

  return result;
}