import { describe, expect, it } from 'vitest';

import type { Expense } from '@/features/expenses/types/expense';
import type { FinancialGoal } from '@/features/goals/types';
import { FinancialEngine } from './financial-engine';

describe('FinancialEngine', () => {
  it('centralizes balance, cash flow, goals and limits in one snapshot', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        description: 'Salário',
        category: 'Receita',
        value: 3000,
        type: 'income',
        createdAt: '2026-07-01T10:00:00.000Z',
      },
      {
        id: '2',
        description: 'Mercado',
        category: 'Alimentação',
        value: 200,
        type: 'expense',
        createdAt: '2026-07-05T10:00:00.000Z',
      },
    ];

    const goals: FinancialGoal[] = [
      {
        id: 'goal-1',
        title: 'Reserva de emergência',
        description: 'Guardar dinheiro',
        category: 'Pessoal',
        type: 'savings',
        targetAmount: 1000,
        currentAmount: 300,
        deadline: '2026-12-31',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      {
        id: 'goal-2',
        title: 'Limite de alimentação',
        description: 'Controle',
        category: 'Alimentação',
        type: 'expense-limit',
        targetAmount: 500,
        currentAmount: 200,
        deadline: '2026-07-31',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const engine = FinancialEngine.create(expenses, goals);

    expect(engine.balance).toBe(2800);
    expect(engine.income).toBe(3000);
    expect(engine.expenses).toBe(200);
    expect(engine.savingsGoals).toHaveLength(1);
    expect(engine.limits).toHaveLength(1);
    expect(engine.patrimony).toBe(3100);
    expect(engine.cashFlow.projectedExpenses).toBeGreaterThan(0);
  });
});
