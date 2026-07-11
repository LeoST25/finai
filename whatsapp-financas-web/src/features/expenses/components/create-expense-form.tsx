import { useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PlusCircle, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  Expense,
  ExpenseType,
} from "@/features/expenses/types/expense";
import { useCreateExpense } from "@/features/expenses/hooks/use-create-expense";
import { useUpdateExpense } from "@/features/expenses/hooks/use-update-expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const expenseCategories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Assinaturas",
  "Outros",
];

const incomeCategories = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Reembolso",
  "Venda",
  "Outros",
];

function normalizeCurrencyValue(value: string) {
  const sanitizedValue = value.trim().replace(/\s/g, "");

  if (sanitizedValue.includes(",")) {
    return Number(sanitizedValue.replace(/\./g, "").replace(",", "."));
  }

  return Number(sanitizedValue);
}

function formatValueForInput(value?: number) {
  if (value === undefined) return "";

  return String(value).replace(".", ",");
}

const schema = z.object({
  description: z.string().min(2, "Informe uma descrição"),
  category: z.string().min(2, "Selecione uma categoria"),
  value: z
    .string()
    .min(1, "Informe um valor")
    .refine((value) => normalizeCurrencyValue(value) > 0, {
      message: "Informe um valor maior que zero",
    }),
  type: z.enum(["income", "expense"]),
});

type FormData = z.infer<typeof schema>;

type CreateExpenseFormProps = {
  mode?: "create" | "edit";
  defaultType?: ExpenseType;
  expense?: Expense;
  onSuccess?: () => void;
};

export function CreateExpenseForm({
  mode = "create",
  defaultType = "expense",
  expense,
  onSuccess,
}: CreateExpenseFormProps) {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  const isEditMode = mode === "edit" && expense;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: expense?.description ?? "",
      category: expense?.category ?? "",
      value: formatValueForInput(expense?.value),
      type: expense?.type ?? defaultType,
    },
  });

  const selectedType = useWatch({
  control,
  name: "type",
});

const selectedCategory = useWatch({
  control,
  name: "category",
});

  const baseCategories =
    selectedType === "income" ? incomeCategories : expenseCategories;

  const categories =
    selectedCategory && !baseCategories.includes(selectedCategory)
      ? [selectedCategory, ...baseCategories]
      : baseCategories;

  const isPending = createExpense.isPending || updateExpense.isPending;

  useEffect(() => {
    reset({
      description: expense?.description ?? "",
      category: expense?.category ?? "",
      value: formatValueForInput(expense?.value),
      type: expense?.type ?? defaultType,
    });
  }, [expense, defaultType, reset]);

  function handleTypeChange(type: ExpenseType) {
    setValue("type", type);

    if (type !== selectedType) {
      setValue("category", "");
    }
  }

  function onSubmit(data: FormData) {
    const payload = {
      description: data.description,
      category: data.category,
      value: normalizeCurrencyValue(data.value),
      type: data.type,
    };

    if (isEditMode) {
      updateExpense.mutate(
        {
          id: expense.id,
          ...payload,
        },
        {
          onSuccess: () => {
            toast.success("Lançamento atualizado com sucesso.");
            onSuccess?.();
          },
          onError: () => {
            toast.error("Não foi possível atualizar o lançamento.");
          },
        },
      );

      return;
    }

    createExpense.mutate(payload, {
      onSuccess: () => {
        toast.success(
          data.type === "income"
            ? "Receita cadastrada com sucesso."
            : "Despesa cadastrada com sucesso.",
        );

        reset({
          description: "",
          category: "",
          value: "",
          type: defaultType,
        });

        onSuccess?.();
      },
      onError: () => {
        toast.error("Não foi possível cadastrar o lançamento.");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={cn(
            "rounded-xl border p-4 text-left transition hover:bg-red-50",
            selectedType === "expense" &&
              "border-red-200 bg-red-50 text-red-700",
          )}
        >
          <p className="font-semibold">Despesa</p>
          <p className="text-xs text-slate-500">Saída de dinheiro</p>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={cn(
            "rounded-xl border p-4 text-left transition hover:bg-emerald-50",
            selectedType === "income" &&
              "border-emerald-200 bg-emerald-50 text-emerald-700",
          )}
        >
          <p className="font-semibold">Receita</p>
          <p className="text-xs text-slate-500">Entrada de dinheiro</p>
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Descrição</label>
        <Input
          placeholder="Ex: Mercado, salário, aluguel..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Categoria</label>
        <select
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          {...register("category")}
        >
          <option value="">Selecione uma categoria</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {errors.category && (
          <p className="text-xs text-red-500">
            {errors.category.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Valor</label>
        <Input
          inputMode="decimal"
          placeholder="0,00"
          {...register("value")}
        />
        {errors.value && (
          <p className="text-xs text-red-500">{errors.value.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isEditMode ? (
          <Save className="mr-2 h-4 w-4" />
        ) : (
          <PlusCircle className="mr-2 h-4 w-4" />
        )}

        {isPending
          ? "Salvando..."
          : isEditMode
            ? "Salvar alterações"
            : "Cadastrar lançamento"}
      </Button>
    </form>
  );
}