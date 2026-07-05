import { useEffect } from "react";
import { Pencil } from "lucide-react";
import type { Expense } from "@/features/expenses/types/expense";
import { useUpdateExpense } from "@/features/expenses/hooks/use-update-expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

type FormData = {
  description: string;
  category: string;
  value: number;
  type: "income" | "expense";
};

type Props = {
  expense: Expense;
};

export function EditExpenseDialog({ expense }: Props) {
  const updateExpense = useUpdateExpense();

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      description: expense.description,
      category: expense.category,
      value: expense.value,
      type: expense.type,
    },
  });

  useEffect(() => {
    reset({
      description: expense.description,
      category: expense.category,
      value: expense.value,
      type: expense.type,
    });
  }, [expense, reset]);

  function onSubmit(data: FormData) {
    updateExpense.mutate({
      id: expense.id,
      ...data,
    });
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar lançamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Descrição" {...register("description")} />

          <Input placeholder="Categoria" {...register("category")} />

          <Input
            type="number"
            step="0.01"
            placeholder="Valor"
            {...register("value", { valueAsNumber: true })}
          />

          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            {...register("type")}
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>

          <Button type="submit" disabled={updateExpense.isPending}>
            {updateExpense.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}