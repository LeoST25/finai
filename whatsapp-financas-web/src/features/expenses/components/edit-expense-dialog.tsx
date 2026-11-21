import { useState } from "react";
import { Pencil } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateExpenseForm } from "./create-expense-form";

type EditExpenseDialogProps = {
  expense: Expense;
};

export function EditExpenseDialog({ expense }: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        title="Editar lançamento"
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar lançamento</DialogTitle>

            <p className="text-sm text-slate-500">
              Atualize as informações deste lançamento financeiro.
            </p>
          </DialogHeader>

          <CreateExpenseForm
            mode="edit"
            expense={expense}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}