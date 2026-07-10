import { formatCurrency } from "@/features/dashboard/ai/financial-formatters";
import type {
  FinancialMetrics,
  FinancialRecommendation,
} from "@/features/dashboard/ai/types";

export function generateFinancialRecommendations(
  metrics: FinancialMetrics,
): FinancialRecommendation[] {
  const recommendations: FinancialRecommendation[] = [];

  if (metrics.balance < 0) {
    recommendations.push({
      title: "Reduza gastos variáveis",
      description:
        "Priorize cortar gastos não essenciais até recuperar o saldo positivo.",
      estimatedImpact: `Meta inicial: reduzir pelo menos ${formatCurrency(
        Math.abs(metrics.balance),
      )}.`,
    });
  }

  if (metrics.savingsRate >= 20) {
    recommendations.push({
      title: "Continue fortalecendo sua reserva",
      description:
        "Sua taxa de economia está saudável. Direcione parte desse saldo para reserva de emergência ou objetivos financeiros.",
      estimatedImpact: `${metrics.savingsRate.toFixed(1)}% da renda preservada.`,
    });
  }

  if (metrics.income > 0 && metrics.savingsRate < 10 && metrics.balance > 0) {
    recommendations.push({
      title: "Aumente sua margem de economia",
      description:
        "Tente elevar sua economia mensal para pelo menos 10% da renda.",
      estimatedImpact: `Meta sugerida: ${formatCurrency(
        metrics.income * 0.1,
      )} por mês.`,
    });
  }

  if (metrics.topCategory && metrics.topCategory.total > 0) {
    recommendations.push({
      title: `Revise gastos com ${metrics.topCategory.name}`,
      description:
        "Essa é sua maior categoria de despesa. Uma pequena redução nela pode gerar impacto relevante.",
      estimatedImpact: `Reduzindo 15%, você economizaria cerca de ${formatCurrency(
        metrics.topCategory.total * 0.15,
      )}.`,
    });
  }

  if (metrics.previousMonthTotal > 0) {
    const variation =
      ((metrics.currentMonthTotal - metrics.previousMonthTotal) /
        metrics.previousMonthTotal) *
      100;

    if (variation > 20) {
      recommendations.push({
        title: "Revisar aumento mensal",
        description:
          "Compare os lançamentos deste mês com o mês anterior e identifique quais gastos causaram o aumento.",
        estimatedImpact: `Aumento detectado: ${formatCurrency(
          metrics.currentMonthTotal - metrics.previousMonthTotal,
        )}.`,
      });
    }

    if (variation < -10) {
      recommendations.push({
        title: "Mantenha o novo padrão",
        description:
          "Você conseguiu reduzir despesas. Tente manter esse patamar nos próximos meses.",
        estimatedImpact: `Redução aproximada: ${formatCurrency(
          metrics.previousMonthTotal - metrics.currentMonthTotal,
        )}.`,
      });
    }
  }

  if (metrics.projectedExpenses > metrics.income && metrics.income > 0) {
    recommendations.push({
      title: "Ajuste o ritmo de gastos",
      description:
        "Sua projeção indica risco de fechar o mês acima da renda. Reduza gastos nos próximos dias.",
      estimatedImpact: `Necessário reduzir cerca de ${formatCurrency(
        metrics.projectedExpenses - metrics.income,
      )} até o fim do mês.`,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Continue registrando seus lançamentos",
      description:
        "Com mais dados, o FinAI poderá gerar recomendações mais específicas para sua rotina financeira.",
    });
  }

  return recommendations;
}