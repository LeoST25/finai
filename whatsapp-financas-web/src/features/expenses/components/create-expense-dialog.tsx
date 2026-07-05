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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={triggerVariant}>
          <Plus className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <CreateExpenseForm
          defaultType={defaultType}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}