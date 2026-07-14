import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import { GoalForm } from './goal-form';

const createGoalMock = vi.fn();
const updateGoalMock = vi.fn();

vi.mock('@/features/goals/hooks', () => ({
  useCreateGoal: () => ({ mutate: createGoalMock, isPending: false }),
  useUpdateGoal: () => ({ mutate: updateGoalMock, isPending: false }),
}));

describe('GoalForm', () => {
  function renderForm() {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <GoalForm mode="create" onSuccess={() => undefined} />
      </QueryClientProvider>,
    );
  }

  it('renders the goal form fields', () => {
    renderForm();

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor objetivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor já acumulado/i)).toBeInTheDocument();
  });

  it('submits the form with valid values', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/título/i), 'Nova meta');
    await user.selectOptions(
      screen.getByLabelText(/categoria/i),
      'Reserva de emergência',
    );
    await user.type(screen.getByLabelText(/valor objetivo/i), '1000');
    await user.type(screen.getByLabelText(/valor já acumulado/i), '100');
    await user.click(screen.getByRole('button', { name: /criar meta/i }));

    expect(createGoalMock).toHaveBeenCalled();
  });
});
