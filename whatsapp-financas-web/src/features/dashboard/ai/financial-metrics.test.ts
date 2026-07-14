import { describe, expect, it } from 'vitest';

import type { Expense } from '@/features/expenses/types/expense';
import { calculateFinancialMetrics } from './financial-metrics';

describe('calculateFinancialMetrics', () => {
  it('uses real expense history to identify the most relevant category and recent activity', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        description: 'Mercado',
        category: 'Alimentação',
        value: 120,
        type: 'expense',
        createdAt: '2026-07-10T10:00:00.000Z',
      },
      {
        id: '2',
        description: 'Uber',
        category: 'Transporte',
        value: 40,
        type: 'expense',
        createdAt: '2026-07-09T10:00:00.000Z',
      },
      {
        id: '3',
        description: 'Mercado',
        category: 'Alimentação',
        value: 80,
        type: 'expense',
        createdAt: '2026-07-04T10:00:00.000Z',
      },
      {
        id: '4',
        description: 'Salário',
        category: 'Receita',
        value: 3000,
        type: 'income',
        createdAt: '2026-07-01T10:00:00.000Z',
      },
    ];

    const metrics = calculateFinancialMetrics(expenses);

    expect(metrics.topCategory?.name).toBe('Alimentação');
    expect(metrics.topCategory?.total).toBe(200);
    expect(metrics.recentExpenseTotal).toBeGreaterThan(0);
    expect(metrics.recentExpenseCount).toBeGreaterThan(0);
  });
});
