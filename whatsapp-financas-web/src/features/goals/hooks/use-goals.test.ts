import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';

import { useGoals } from './use-goals';
import * as goalsService from '@/features/goals/services/goals.service';

vi.mock('@/features/goals/services/goals.service', () => ({
  getGoals: vi.fn(),
}));

describe('useGoals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createWrapper() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return ({ children }: { children: ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children,
      );
  }

  it('loads goals and computes progress', async () => {
    vi.mocked(goalsService.getGoals).mockResolvedValue([
      {
        id: 'goal-1',
        title: 'Reserva',
        description: 'Guardar dinheiro',
        category: 'Pessoal',
        type: 'savings',
        targetAmount: 1000,
        currentAmount: 400,
        deadline: '2026-12-31',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ]);

    const { result } = renderHook(() => useGoals(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.goals).toHaveLength(1));

    expect(result.current.goals[0]?.progress.percentage).toBe(40);
    expect(result.current.goals[0]?.progress.status).toBe('in-progress');
  });
});
