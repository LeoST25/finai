import { useState, type MouseEvent } from 'react';
import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { FinancialGoalWithProgress } from '@/features/goals/hooks';
import { DeleteGoalDialog } from './delete-goal-dialog';
import { EditGoalDialog } from './edit-goal-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type GoalCardProps = {
  goal: FinancialGoalWithProgress;
};

function getStatusLabel(
  status: FinancialGoalWithProgress['progress']['status'],
) {
  const labels = {
    'not-started': 'Não iniciada',
    'in-progress': 'Em andamento',
    'almost-complete': 'Próxima do limite',
    completed: 'Concluída',
    exceeded: 'Limite ultrapassado',
  };

  return labels[status];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function GoalCard({ goal }: GoalCardProps) {
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const progressPercentage = Math.min(goal.progress.percentage, 100);

  const goalTypeLabel =
    goal.type === 'savings' ? 'Meta de economia' : 'Limite de gastos';

  function handleDeleteActionClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
  }

  function handleDeleteDialogOpenChange(nextOpen: boolean) {
    setIsDeleteDialogOpen(nextOpen);

    if (!nextOpen) {
      setIsActionsMenuOpen(false);
    }
  }

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{goalTypeLabel}</p>

          <h3 className="mt-1 truncate text-lg font-semibold text-slate-900">
            {goal.title}
          </h3>

          {goal.category && (
            <p className="mt-1 truncate text-sm text-slate-500">
              {goal.category}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-start gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {getStatusLabel(goal.progress.status)}
          </span>

          <div className="flex items-center gap-1">
            <DropdownMenu
              open={isActionsMenuOpen}
              onOpenChange={setIsActionsMenuOpen}
            >
              <DropdownMenuTrigger>
                <button
                  type="button"
                  title="Mais ações"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <EditGoalDialog
                  goal={goal}
                  trigger={
                    <button
                      type="button"
                      onMouseDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                      className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </button>
                  }
                />

                <DropdownMenuItem
                  onClick={() => {
                    toast.info('Duplicação de metas em breve.');
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicar
                </DropdownMenuItem>

                <DeleteGoalDialog
                  goal={goal}
                  open={isDeleteDialogOpen}
                  onOpenChange={handleDeleteDialogOpenChange}
                  trigger={
                    <button
                      type="button"
                      onMouseDown={(event) => event.stopPropagation()}
                      onClick={handleDeleteActionClick}
                      className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm text-red-600 transition hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </button>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">Progresso</span>

          <strong className="text-slate-900">
            {goal.progress.percentage}%
          </strong>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Atual
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Objetivo
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        {goal.progress.status === 'exceeded' ? (
          <p className="text-sm font-medium text-red-600">
            Limite de gastos ultrapassado em{' '}
            {formatCurrency(goal.currentAmount - goal.targetAmount)}
          </p>
        ) : goal.progress.status === 'completed' ? (
          <p className="text-sm font-medium text-emerald-600">
            {goal.type === 'savings'
              ? 'Meta concluída com sucesso.'
              : 'Limite de gastos concluído com sucesso.'}
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            {goal.type === 'savings' ? (
              <>
                Faltam{' '}
                <strong>{formatCurrency(goal.progress.remainingAmount)}</strong>{' '}
                para concluir esta meta.
              </>
            ) : (
              <>
                Restam{' '}
                <strong>{formatCurrency(goal.progress.remainingAmount)}</strong>{' '}
                disponíveis dentro deste limite.
              </>
            )}
          </p>
        )}

        {goal.progress.daysRemaining !== undefined && (
          <p className="mt-2 text-sm text-slate-500">
            {goal.progress.daysRemaining === 0
              ? 'Prazo encerrado.'
              : `${goal.progress.daysRemaining} dias restantes.`}
          </p>
        )}
      </div>
    </article>
  );
}
