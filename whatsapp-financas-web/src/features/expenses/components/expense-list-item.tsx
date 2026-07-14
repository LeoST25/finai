import { toast } from 'sonner';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Trash2,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import type { Expense } from '@/features/expenses/types/expense';
import { useDeleteExpense } from '@/features/expenses/hooks/use-delete-expense';
import { EditExpenseDialog } from '@/features/expenses/components/edit-expense-dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format-currency';
import { cn } from '@/lib/utils';

type ExpenseListItemProps = {
  expense: Expense;
  actionsVisibility?: 'always' | 'hover';
};

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

const styles = {
  income: {
    label: 'Receita',
    icon: ArrowUpCircle,
    amount: 'text-emerald-600',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    iconBox: 'bg-emerald-50 text-emerald-600',
    signal: '+',
  },
  expense: {
    label: 'Despesa',
    icon: ArrowDownCircle,
    amount: 'text-red-600',
    badge: 'border-red-200 bg-red-50 text-red-700',
    iconBox: 'bg-red-50 text-red-600',
    signal: '-',
  },
};

export function ExpenseListItem({
  expense,
  actionsVisibility = 'always',
}: ExpenseListItemProps) {
  const deleteExpense = useDeleteExpense();

  const style = styles[expense.type];
  const Icon = style.icon;

  function handleDelete(): void {
    deleteExpense.mutate(expense.id, {
      onSuccess: () => {
        toast.success('Lançamento excluído com sucesso.');
      },

      onError: (error) => {
        console.error('Erro ao excluir lançamento:', error);
        toast.error('Não foi possível excluir o lançamento.');
      },
    });
  }

  return (
    <div className="group flex flex-col gap-4 rounded-xl border bg-white p-4 transition hover:border-slate-300 hover:shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11',
            style.iconBox,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="max-w-full truncate font-semibold text-slate-900">
              {expense.description}
            </p>

            <Badge
              variant="outline"
              className={cn('rounded-full', style.badge)}
            >
              {style.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="max-w-full truncate">{expense.category}</span>

            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(expense.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-3 lg:border-t-0 lg:pt-0">
        <p
          className={cn(
            'min-w-0 truncate text-right text-base font-bold sm:min-w-32',
            style.amount,
          )}
        >
          {style.signal}
          {formatCurrency(expense.value)}
        </p>

        <div
          className={cn(
            'relative z-10 flex shrink-0 items-center gap-1 transition',
            actionsVisibility === 'hover' &&
              'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
          )}
        >
          
          <EditExpenseDialog expense={expense} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                title="Excluir lançamento"
                disabled={deleteExpense.isPending}
                className="relative z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="pointer-events-none h-4 w-4" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir lançamento?</AlertDialogTitle>

                <AlertDialogDescription>
                  O lançamento &quot;{expense.description}&quot; será excluído
                  permanentemente. Essa ação não poderá ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteExpense.isPending}>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  type="button"
                  disabled={deleteExpense.isPending}
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {deleteExpense.isPending ? 'Excluindo...' : 'Excluir'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
