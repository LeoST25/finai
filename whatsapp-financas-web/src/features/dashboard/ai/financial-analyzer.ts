import type { Expense } from "@/features/expenses/types/expense";
import { calculateFinancialMetrics } from "@/features/dashboard/ai/financial-metrics";
import { calculateFinancialScore } from "@/features/dashboard/ai/financial-score";
import { generateFinancialInsights } from "@/features/dashboard/ai/financial-insights";
import { generateFinancialRecommendations } from "@/features/dashboard/ai/financial-recommendations";
import type { FinancialAnalysis } from "@/features/dashboard/ai/types";

export function analyzeFinancialData(expenses: Expense[]): FinancialAnalysis {
  const metrics = calculateFinancialMetrics(expenses);
  const score = calculateFinancialScore(metrics);
  const insights = generateFinancialInsights(metrics);
  const recommendations = generateFinancialRecommendations(metrics);

  return {
    score,
    balance: metrics.balance,
    income: metrics.income,
    expenses: metrics.totalExpenses,
    savingsRate: metrics.savingsRate,
    insights,
    recommendations,
  };
}

export type {
  FinancialAnalysis,
  FinancialInsight,
  FinancialInsightType,
  FinancialRecommendation,
} from "@/features/dashboard/ai/types";