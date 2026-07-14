import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Pencil } from 'lucide-react';

import type { FinancialGoal } from '@/features/goals/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GoalForm } from './goal-form';

type EditGoalDialogProps = {
  goal: FinancialGoal;
  trigger?: ReactNode;
};

export function EditGoalDialog({ goal, trigger }: EditGoalDialogProps) {
  const [open, setOpen] = useState(false);

  const triggerElement = trigger ? (
    isValidElement(trigger) ? (
      cloneElement(
        trigger as ReactElement<{
          onClick?: (event: React.MouseEvent<HTMLElement>) => void;
          onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
        }>,
        {
          onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            const existingOnMouseDown = (
              trigger as ReactElement<{
                onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
              }>
            ).props.onMouseDown;

            if (typeof existingOnMouseDown === 'function') {
              existingOnMouseDown(event);
            }
          },
          onClick: (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            event.stopPropagation();

            const existingOnClick = (
              trigger as ReactElement<{
                onClick?: (event: React.MouseEvent<HTMLElement>) => void;
              }>
            ).props.onClick;

            if (typeof existingOnClick === 'function') {
              existingOnClick(event);
            }

            setOpen(true);
          },
        },
      )
    ) : null
  ) : (
    <button
      type="button"
      title="Editar meta"
      aria-label={`Editar meta ${goal.title}`}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen(true);
      }}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );

  return (
    <>
      {triggerElement}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar meta financeira</DialogTitle>

            <p className="text-sm text-slate-500">
              Atualize os valores, o prazo e as informações desta meta.
            </p>
          </DialogHeader>

          <GoalForm mode="edit" goal={goal} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
