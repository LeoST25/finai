import { z } from "zod";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateExpense } from "@/features/expenses/hooks/use-create-expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const schema = z.object({
  description: z.string().min(2, "Informe uma descrição"),
  category: z.string().min(2, "Informe uma categoria"),
  value: z.number().positive("Informe um valor maior que zero"),
  type: z.enum(["income", "expense"]),
});

type FormData = z.infer<typeof schema>;

export function CreateExpenseForm() {
  const createExpense = useCreateExpense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      category: "",
      value: 0,
      type: "expense",
    },
  });

  function onSubmit(data: FormData) {
    createExpense.mutate(data, {
      onSuccess: () => {
        toast.success(
          data.type === "income"
            ? "Receita cadastrada com sucesso."
            : "Despesa cadastrada com sucesso.",
        );

        reset({
          description: "",
          category: "",
          value: 0,
          type: "expense",
        });
      },
      onError: () => {
        toast.error("Não foi possível cadastrar o lançamento.");
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo lançamento</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto]"
        >
          <div className="space-y-1">
            <Input placeholder="Descrição" {...register("description")} />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input placeholder="Categoria" {...register("category")} />
            {errors.category && (
              <p className="text-xs text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              type="number"
              step="0.01"
              placeholder="Valor"
              {...register("value", { valueAsNumber: true })}
            />
            {errors.value && (
              <p className="text-xs text-red-500">{errors.value.message}</p>
            )}
          </div>

          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            {...register("type")}
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>

          <Button type="submit" disabled={createExpense.isPending}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {createExpense.isPending ? "Salvando..." : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}