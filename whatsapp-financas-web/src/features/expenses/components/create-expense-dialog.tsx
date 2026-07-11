import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateExpenseForm } from "./create-expense-form";

type CreateExpenseDialogProps = {
  triggerLabel?: string;
  triggerVariant?: "default" | "secondary" | "outline" | "ghost";
  defaultType?: "income" | "expense";
};

export function CreateExpenseDialog({
  triggerLabel = "Novo lançamento",
  triggerVariant = "default",
  defaultType = "expense",
}: CreateExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const title =
    defaultType === "income" ? "Nova receita" : "Nova despesa";

  const description =
    defaultType === "income"
      ? "Cadastre uma entrada financeira para acompanhar melhor seus ganhos."
      : "Cadastre uma saída financeira para manter seu controle atualizado.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={triggerVariant}>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <p className="text-sm text-slate-500">{description}</p>
        </DialogHeader>

        <CreateExpenseForm
          defaultType={defaultType}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}