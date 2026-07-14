import type { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
import { useDeleteGoal } from '@/features/goals/hooks';
import type { FinancialGoalWithProgress } from '@/features/goals/hooks';
import { cn } from '@/lib/utils';

type DeleteGoalDialogProps = {
  goal: FinancialGoalWithProgress;
  className?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DeleteGoalDialog({
  goal,
  className,
  trigger,
  open,
  onOpenChange,
}: DeleteGoalDialogProps) {
  const deleteGoal = useDeleteGoal();

  function handleDelete(): void {
    deleteGoal.mutate(goal.id, {
      onSuccess: () => {
        toast.success('Meta excluída com sucesso.');
        onOpenChange?.(false);
      },

      onError: (error) => {
        console.error('Erro ao excluir meta:', error);
        toast.error('Não foi possível excluir a meta.');
      },
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            title="Excluir meta"
            disabled={deleteGoal.isPending}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir meta?</AlertDialogTitle>

          <AlertDialogDescription>
            A meta &quot;{goal.title}&quot; será excluída permanentemente. Essa
            ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteGoal.isPending}>
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            disabled={deleteGoal.isPending}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleteGoal.isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
