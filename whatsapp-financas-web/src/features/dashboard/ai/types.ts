export type FinancialInsightType =
  | "success"
  | "warning"
  | "danger"
  | "info";

export type FinancialMetrics = {
  income: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  currentMonthTotal: number;
  previousMonthTotal: number;
  projectedExpenses: number;
  topCategory?: {
    name: string;
    total: number;
  };
};

export type FinancialInsight = {
  title: string;
  description: string;
  type: FinancialInsightType;
};

export type FinancialRecommendation = {
  title: string;
  description: string;
  estimatedImpact?: string;
};

export type FinancialAnalysis = {
  score: number;
  balance: number;
  income: number;
  totalExpenses: number;
  savingsRate: number;
  insights: FinancialInsight[];
  recommendations: FinancialRecommendation[];
};