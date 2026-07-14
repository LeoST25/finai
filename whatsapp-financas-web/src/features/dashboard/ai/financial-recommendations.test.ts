import { describe, expect, it } from 'vitest';

import {
  generateFinancialRecommendations,
  groupRecommendationsByPriority,
} from './financial-recommendations';
import type { FinancialMetrics } from './types';

describe('generateFinancialRecommendations', () => {
  it('prioritizes urgent recommendations with human and contextual language', () => {
    const metrics: FinancialMetrics = {
      totalIncome: 3000,
      totalExpenses: 3200,
      balance: -200,
      savingsRate: 4,
      currentMonthTotal: 3200,
      previousMonthTotal: 2500,
      projectedExpenses: 3800,
      recentExpenseTotal: 180,
      recentExpenseCount: 3,
      topCategory: {
        name: 'Alimentação',
        total: 900,
      },
    };

    const recommendations = generateFinancialRecommendations(metrics);

    expect(recommendations[0]?.priority).toBe('high');
    expect(recommendations[0]?.description).toContain('negativo');
    expect(recommendations[0]?.description).toContain('R$');
  });

  it('groups recommendations by urgency so the assistant feels more organized', () => {
    const metrics: FinancialMetrics = {
      totalIncome: 3000,
      totalExpenses: 3200,
      balance: -200,
      savingsRate: 4,
      currentMonthTotal: 3200,
      previousMonthTotal: 2500,
      projectedExpenses: 3800,
      recentExpenseTotal: 180,
      recentExpenseCount: 3,
      topCategory: {
        name: 'Alimentação',
        total: 900,
      },
    };

    const recommendations = generateFinancialRecommendations(metrics);
    const grouped = groupRecommendationsByPriority(recommendations);

    expect(grouped.high.length).toBeGreaterThan(0);
    expect(grouped.medium.length).toBeGreaterThanOrEqual(0);
    expect(grouped.low.length).toBeGreaterThanOrEqual(0);
  });
});
