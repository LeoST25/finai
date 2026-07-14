import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GoalCard } from './goal-card';

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('GoalCard', () => {
  const goal = {
    id: 'goal-1',
    title: 'Reserva de emergência',
    description: 'Guardar dinheiro',
    category: 'Pessoal',
    type: 'savings' as const,
    targetAmount: 1000,
    currentAmount: 400,
    deadline: '2026-12-31',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    progress: {
      percentage: 40,
      remainingAmount: 600,
      status: 'in-progress' as const,
      daysRemaining: 20,
    },
  };

  it('renders goal summary and the actions trigger', () => {
    render(<GoalCard goal={goal} />);

    expect(screen.getByText('Reserva de emergência')).toBeInTheDocument();
    expect(screen.getByText('Progresso')).toBeInTheDocument();
    expect(screen.getByTitle('Mais ações')).toBeInTheDocument();
  });
});
