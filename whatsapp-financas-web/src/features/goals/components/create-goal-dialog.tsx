import {
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { GoalForm } from './goal-form';

type CreateGoalDialogProps = {
  trigger?: ReactNode;
};

export function CreateGoalDialog({ trigger }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);

  const triggerElement = trigger ? (
    isValidElement(trigger) ? (
      cloneElement(
        trigger as ReactElement<{
          onClick?: (event: React.MouseEvent<HTMLElement>) => void;
        }>,
        {
          onClick: (event: React.MouseEvent<HTMLElement>) => {
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
    <Button onClick={() => setOpen(true)}>
      <Plus className="mr-2 h-4 w-4" />
      Nova meta
    </Button>
  );

  return (
    <>
      {triggerElement}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova meta financeira</DialogTitle>

            <p className="text-sm text-slate-500">
              Crie metas de economia ou limites de despesas para que o FinAI
              acompanhe sua evolução.
            </p>
          </DialogHeader>

          <GoalForm mode="create" onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
