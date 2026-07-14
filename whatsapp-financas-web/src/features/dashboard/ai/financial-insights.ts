import { formatCurrency } from "@/features/dashboard/ai/financial-formatters";
import type {
  FinancialInsight,
  FinancialMetrics,
} from "@/features/dashboard/ai/types";

export function generateFinancialInsights(
  metrics: FinancialMetrics,
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];

  if (metrics.balance > 0) {
    insights.push({
      type: "success",
      title: "Saldo positivo",
      description: `Você está com saldo positivo de ${formatCurrency(
        metrics.balance,
      )}.`,
    });
  }

  if (metrics.balance < 0) {
    insights.push({
      type: "danger",
      title: "Saldo negativo",
      description: `Suas despesas ultrapassaram suas receitas em ${formatCurrency(
        Math.abs(metrics.balance),
      )}.`,
    });
  }

  if (metrics.savingsRate >= 20) {
    insights.push({
      type: "success",
      title: "Boa taxa de economia",
      description: `Você está economizando aproximadamente ${metrics.savingsRate.toFixed(
        1,
      )}% da sua renda.`,
    });
  }

  if (metrics.totalIncome > 0 && metrics.savingsRate < 10 && metrics.balance > 0) {
    insights.push({
      type: "warning",
      title: "Economia baixa",
      description:
        "Você está fechando positivo, mas sua taxa de economia ainda está baixa.",
    });
  }

  if (metrics.totalExpenses > metrics.totalIncome && metrics.totalIncome > 0) {
    insights.push({
      type: "danger",
      title: "Despesas acima da renda",
      description:
        "Suas despesas estão maiores que suas receitas. Revise os gastos variáveis.",
    });
  }

  if (metrics.topCategory) {
    insights.push({
      type: "info",
      title: "Maior categoria de gasto",
      description: `${metrics.topCategory.name} concentra ${formatCurrency(
        metrics.topCategory.total,
      )} em despesas.`,
    });
  }

  if (metrics.previousMonthTotal > 0) {
    const variation =
      ((metrics.currentMonthTotal - metrics.previousMonthTotal) /
        metrics.previousMonthTotal) *
      100;

    if (variation > 20) {
      insights.push({
        type: "warning",
        title: "Despesas em alta",
        description: `Seus gastos deste mês estão ${variation.toFixed(
          1,
        )}% maiores que no mês anterior.`,
      });
    }

    if (variation < -10) {
      insights.push({
        type: "success",
        title: "Despesas em queda",
        description: `Você reduziu seus gastos em ${Math.abs(
          variation,
        ).toFixed(1)}% em comparação ao mês anterior.`,
      });
    }
  }

  if (metrics.projectedExpenses > 0) {
    insights.push({
      type:
        metrics.projectedExpenses > metrics.totalIncome && metrics.totalIncome > 0
          ? "warning"
          : "info",
      title: "Projeção do mês",
      description: `No ritmo atual, suas despesas podem chegar a ${formatCurrency(
        metrics.projectedExpenses,
      )} até o fim do mês.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Poucos dados para análise",
      description:
        "Continue registrando seus lançamentos para receber insights melhores.",
    });
  }

  return insights;
}