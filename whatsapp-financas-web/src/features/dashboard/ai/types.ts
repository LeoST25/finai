export type FinancialInsightType = 'success' | 'warning' | 'danger' | 'info';

export type FinancialMetrics = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  currentMonthTotal: number;
  previousMonthTotal: number;
  projectedExpenses: number;
  recentExpenseTotal: number;
  recentExpenseCount: number;
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

export type RecommendationPriority = 'high' | 'medium' | 'low';

export type FinancialRecommendation = {
  title: string;
  description: string;
  estimatedImpact?: string;
  priority?: RecommendationPriority;
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
