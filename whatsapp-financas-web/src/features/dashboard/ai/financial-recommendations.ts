import { formatCurrency } from '@/features/dashboard/ai/financial-formatters';
import type {
  FinancialMetrics,
  FinancialRecommendation,
  RecommendationPriority,
} from '@/features/dashboard/ai/types';

const priorityOrder: Record<RecommendationPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function createRecommendation(
  title: string,
  description: string,
  priority: RecommendationPriority,
  estimatedImpact?: string,
): FinancialRecommendation {
  return {
    title,
    description,
    priority,
    estimatedImpact,
  };
}

export function generateFinancialRecommendations(
  metrics: FinancialMetrics,
): FinancialRecommendation[] {
  const recommendations: FinancialRecommendation[] = [];

  if (metrics.balance < 0) {
    recommendations.push(
      createRecommendation(
        'Parece que o mês está apertado',
        `Seu saldo está negativo em ${formatCurrency(
          Math.abs(metrics.balance),
        )}. Vamos reduzir gastos não urgentes e dar um jeito de fechar o mês com mais tranquilidade.`,
        'high',
        `Meta imediata: equilibrar o mês com pelo menos ${formatCurrency(
          Math.abs(metrics.balance),
        )}.`,
      ),
    );
  }

  if (metrics.savingsRate >= 20) {
    recommendations.push(
      createRecommendation(
        'Sua reserva está indo bem',
        `Sua taxa de economia está saudável (${metrics.savingsRate.toFixed(1)}%). Você pode aproveitar esse momento para fortalecer a reserva ou preparar uma nova meta.`,
        'medium',
        `${metrics.savingsRate.toFixed(1)}% da renda preservada.`,
      ),
    );
  }

  if (
    metrics.totalIncome > 0 &&
    metrics.savingsRate < 10 &&
    metrics.balance > 0
  ) {
    recommendations.push(
      createRecommendation(
        'Você pode ganhar mais folga no mês',
        `Você fechou o mês com saldo positivo, mas ainda dá para melhorar. Tente reservar pelo menos ${formatCurrency(metrics.totalIncome * 0.1)} por mês.`,
        'medium',
        `Meta sugerida: ${formatCurrency(metrics.totalIncome * 0.1)} por mês.`,
      ),
    );
  }

  if (metrics.topCategory && metrics.topCategory.total > 0) {
    recommendations.push(
      createRecommendation(
        `Vamos olhar com calma os gastos em ${metrics.topCategory.name}`,
        `${metrics.topCategory.name} está concentrando bastante do seu mês. Uma redução pequena já pode dar um alivio bem visível no saldo.`,
        'medium',
        `Reduzindo 15%, você economizaria cerca de ${formatCurrency(
          metrics.topCategory.total * 0.15,
        )}.`,
      ),
    );
  }

  if (metrics.previousMonthTotal > 0) {
    const variation =
      ((metrics.currentMonthTotal - metrics.previousMonthTotal) /
        metrics.previousMonthTotal) *
      100;

    if (variation > 20) {
      recommendations.push(
        createRecommendation(
          'O ritmo de gastos mudou',
          `Os gastos deste mês subiram ${variation.toFixed(1)}% em relação ao mês anterior. Vale a pena revisar os lançamentos para entender o que mudou.`,
          'medium',
          `Aumento detectado: ${formatCurrency(
            metrics.currentMonthTotal - metrics.previousMonthTotal,
          )}.`,
        ),
      );
    }

    if (variation < -10) {
      recommendations.push(
        createRecommendation(
          'Você está no caminho certo',
          `Você conseguiu reduzir despesas em ${Math.abs(variation).toFixed(1)}% em relação ao mês anterior. Continue assim para preservar a folga.`,
          'low',
          `Redução aproximada: ${formatCurrency(
            metrics.previousMonthTotal - metrics.currentMonthTotal,
          )}.`,
        ),
      );
    }
  }

  if (
    metrics.projectedExpenses > metrics.totalIncome &&
    metrics.totalIncome > 0
  ) {
    recommendations.push(
      createRecommendation(
        'O fim do mês merece atenção',
        `Sua projeção aponta que o mês pode fechar ${formatCurrency(
          metrics.projectedExpenses - metrics.totalIncome,
        )} acima da renda. Reduzir gastos nos próximos dias ajuda a evitar o descontrole.`,
        'high',
        `Necessário reduzir cerca de ${formatCurrency(
          metrics.projectedExpenses - metrics.totalIncome,
        )} até o fim do mês.`,
      ),
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      createRecommendation(
        'Vamos preencher mais dados',
        'Ainda estou com poucos sinais para te orientar com precisão. Quanto mais lançamentos você registrar, mais eu consigo te ajudar.',
        'low',
      ),
    );
  }

  return recommendations.sort(
    (left, right) =>
      (priorityOrder[right.priority ?? 'low'] ?? 0) -
      (priorityOrder[left.priority ?? 'low'] ?? 0),
  );
}

export function groupRecommendationsByPriority(
  recommendations: FinancialRecommendation[],
) {
  return {
    high: recommendations.filter((item) => item.priority === 'high'),
    medium: recommendations.filter((item) => item.priority === 'medium'),
    low: recommendations.filter((item) => item.priority === 'low'),
  };
}
