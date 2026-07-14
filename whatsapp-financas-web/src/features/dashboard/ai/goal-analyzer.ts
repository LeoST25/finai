import type { FinancialGoalWithProgress } from '@/features/goals/hooks';
import type {
  FinancialInsight,
  FinancialRecommendation,
} from '@/features/dashboard/ai/financial-analyzer';
import type { FinancialMetrics } from '@/features/dashboard/ai/types';

type GoalAnalysisResult = {
  insights: FinancialInsight[];
  recommendations: FinancialRecommendation[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function analyzeSavingsGoal(
  goal: FinancialGoalWithProgress,
  result: GoalAnalysisResult,
  metrics: FinancialMetrics,
) {
  const { percentage, remainingAmount, status, daysRemaining } = goal.progress;

  if (status === 'completed') {
    result.insights.push({
      title: `Meta concluída: ${goal.title}`,
      description: `Você atingiu ${percentage}% dessa meta financeira.`,
      type: 'success',
    });

    result.recommendations.push({
      title: 'Defina um novo objetivo',
      description: `A meta "${goal.title}" foi concluída. Considere aumentar o objetivo ou criar uma nova meta.`,
    });

    return;
  }

  if (status === 'almost-complete') {
    result.insights.push({
      title: `${goal.title} está quase concluída`,
      description: `Você já atingiu ${percentage}% da meta. Faltam ${formatCurrency(
        remainingAmount,
      )}.`,
      type: 'success',
    });
  }

  if (daysRemaining !== undefined && daysRemaining > 0 && remainingAmount > 0) {
    const dailyAmount = remainingAmount / daysRemaining;

    result.recommendations.push({
      title: `Plano para ${goal.title}`,
      description: `Reserve aproximadamente ${formatCurrency(
        dailyAmount,
      )} por dia para atingir essa meta no prazo.`,
      estimatedImpact: formatCurrency(remainingAmount),
      priority:
        daysRemaining !== undefined && daysRemaining <= 7 ? 'high' : 'medium',
    });
  }

  if (metrics.balance < 0 && remainingAmount > 0) {
    result.insights.push({
      title: `Saldo negativo impacta ${goal.title}`,
      description: `Seu saldo atual é ${formatCurrency(metrics.balance)} e ainda faltam ${formatCurrency(remainingAmount)} para concluir essa meta.`,
      type: 'warning',
    });

    result.recommendations.push({
      title: `Priorize ${goal.title} no orçamento`,
      description: `Redirecione parte do saldo disponível para essa meta e reduza gastos variáveis até o saldo mensal se manter positivo.`,
      estimatedImpact: formatCurrency(
        Math.min(remainingAmount, Math.max(metrics.balance * -1, 0)),
      ),
      priority: 'high',
    });
  }

  if (daysRemaining === 0) {
    result.insights.push({
      title: `Prazo encerrado: ${goal.title}`,
      description: `A meta encerrou com ${percentage}% de progresso.`,
      type: 'warning',
    });

    result.recommendations.push({
      title: 'Revise o prazo da meta',
      description: `A meta "${goal.title}" ainda precisa de ${formatCurrency(
        remainingAmount,
      )}. Atualize o prazo ou ajuste o valor desejado.`,
      priority: 'medium',
    });
  }
}

function analyzeCategoryLimit(
  goal: FinancialGoalWithProgress,
  result: GoalAnalysisResult,
  metrics: FinancialMetrics,
) {
  const { percentage, status, remainingAmount } = goal.progress;
  const category = goal.category ?? goal.title;

  if (status === 'exceeded') {
    const exceededAmount = goal.currentAmount - goal.targetAmount;

    result.insights.push({
      title: `Limite ultrapassado em ${category}`,
      description: `Você gastou ${formatCurrency(
        exceededAmount,
      )} acima do limite definido.`,
      type: 'danger',
    });

    result.recommendations.push({
      title: `Reduza gastos em ${category}`,
      description: `Evite novos gastos nessa categoria até o próximo período e revise os lançamentos recentes.`,
      estimatedImpact: formatCurrency(exceededAmount),
      priority: 'high',
    });

    return;
  }

  if (metrics.balance < 0 && remainingAmount > 0 && percentage >= 60) {
    result.insights.push({
      title: `${category} precisa de atenção imediata`,
      description: `Seu saldo atual é ${formatCurrency(metrics.balance)} e você já utilizou ${formatCurrency(goal.currentAmount)} de ${formatCurrency(goal.targetAmount)} em ${category}.`,
      type: 'warning',
    });

    result.recommendations.push({
      title: `Ajuste o gasto em ${category}`,
      description: `Use os lançamentos reais do mês para reduzir o uso de ${category} e preservar o saldo disponível para outras metas.`,
      estimatedImpact: formatCurrency(remainingAmount),
      priority: 'medium',
    });
  }

  if (percentage >= 80) {
    result.insights.push({
      title: `${category} próximo do limite`,
      description: `Você já utilizou ${percentage}% do limite dessa categoria.`,
      type: 'warning',
    });

    result.recommendations.push({
      title: `Controle os próximos gastos em ${category}`,
      description: `Restam apenas ${formatCurrency(
        remainingAmount,
      )} antes de atingir o limite.`,
      estimatedImpact: formatCurrency(remainingAmount),
      priority: 'medium',
    });
  }
}

export function analyzeFinancialGoals(
  goals: FinancialGoalWithProgress[],
  metrics: FinancialMetrics,
): GoalAnalysisResult {
  const result: GoalAnalysisResult = {
    insights: [],
    recommendations: [],
  };

  goals.forEach((goal) => {
    if (goal.type === 'savings') {
      analyzeSavingsGoal(goal, result, metrics);
      return;
    }

    analyzeCategoryLimit(goal, result, metrics);
  });

  return result;
}
