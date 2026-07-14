import type { Expense } from "@/features/expenses/types/expense";
import { calculateFinancialMetrics } from "@/features/dashboard/ai/financial-metrics";
import { calculateFinancialScore } from "@/features/dashboard/ai/financial-score";
import { generateFinancialInsights } from "@/features/dashboard/ai/financial-insights";
import { generateFinancialRecommendations } from "@/features/dashboard/ai/financial-recommendations";
import type { FinancialAnalysis } from "@/features/dashboard/ai/types";

import type { FinancialGoalWithProgress } from "@/features/goals/hooks";
import { analyzeFinancialGoals } from "./goal-analyzer";

export function analyzeFinancialData(
  expenses: Expense[],
  goals: FinancialGoalWithProgress[] = [],
): FinancialAnalysis {
  const metrics = calculateFinancialMetrics(expenses);
  const goalAnalysis = analyzeFinancialGoals(goals, metrics);
  const score = calculateFinancialScore(metrics);
  const insights = generateFinancialInsights(metrics);
  const recommendations = generateFinancialRecommendations(metrics);

  return {
    score,
    balance: metrics.balance,
    income: metrics.totalIncome,
    totalExpenses: metrics.totalExpenses,
    savingsRate: metrics.savingsRate,
    insights: [...insights, ...goalAnalysis.insights],
    recommendations: [
      ...recommendations,
      ...goalAnalysis.recommendations,
    ],
  };
}

export type {
  FinancialAnalysis,
  FinancialInsight,
  FinancialInsightType,
  FinancialRecommendation,
  FinancialMetrics,
} from "@/features/dashboard/ai/types";