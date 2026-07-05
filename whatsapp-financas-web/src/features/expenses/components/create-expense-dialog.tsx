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
};

export function CreateExpenseDialog({
  triggerLabel = "Novo lançamento",
  triggerVariant = "default",
}: CreateExpenseDialogProps) {
  const [open, setOpen] = useState(false);

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
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>

        <CreateExpenseForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}