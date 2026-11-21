import type { FinancialMetrics } from "@/features/dashboard/ai/types";

export function calculateFinancialScore(metrics: FinancialMetrics) {
  let score = 50;

  if (metrics.balance > 0) score += 20;
  if (metrics.savingsRate >= 10) score += 10;
  if (metrics.savingsRate >= 20) score += 10;
  if (metrics.totalExpenses > metrics.income) score -= 25;
  if (metrics.income === 0 && metrics.totalExpenses > 0) score -= 20;

  if (
    metrics.currentMonthTotal > metrics.previousMonthTotal &&
    metrics.previousMonthTotal > 0
  ) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}