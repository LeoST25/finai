import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  MoreHorizontal,
  Receipt,
  Trash2,
} from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import { useDeleteExpense } from "@/features/expenses/hooks/use-delete-expense";
import { EditExpenseDialog } from "@/features/expenses/components/edit-expense-dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/shared/feedback/empty-state";
import { DashboardWidget } from "@/shared/ui/components/dashboard-widget";
import { formatCurrency } from "@/utils/format-currency";
import { cn } from "@/lib/utils";

type Props = {
  expenses: Expense[];
};

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const transactionStyles = {
  income: {
    label: "Receita",
    icon: ArrowUpCircle,
    amount: "text-emerald-600",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    iconBox: "bg-emerald-50 text-emerald-600",
    signal: "+",
  },
  expense: {
    label: "Despesa",
    icon: ArrowDownCircle,
    amount: "text-red-600",
    badge: "border-red-200 bg-red-50 text-red-700",
    iconBox: "bg-red-50 text-red-600",
    signal: "-",
  },
};

export function LatestTransactions({ expenses }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteExpense = useDeleteExpense();

  const latest = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  function handleDelete(expense: Expense) {
    const confirmed = window.confirm(
      `Deseja excluir o lançamento "${expense.description}"?`,
    );

    if (!confirmed) return;

    setDeletingId(expense.id);

    deleteExpense.mutate(expense.id, {
      onSuccess: () => {
        toast.success("Lançamento excluído com sucesso.");
      },
      onError: () => {
        toast.error("Não foi possível excluir o lançamento.");
      },
      onSettled: () => {
        setDeletingId(null);
      },
    });
  }

  return (
    <DashboardWidget
      title="Últimas transações"
      description="Lançamentos mais recentes."
    >
      {latest.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhuma transação registrada"
          description="Registre sua primeira receita ou despesa pelo WhatsApp ou pelo formulário do dashboard."
        />
      ) : (
        <div className="space-y-3">
          {latest.map((expense) => {
            const style = transactionStyles[expense.type];
            const Icon = style.icon;
            const isDeleting = deletingId === expense.id;

            return (
              <div
                key={expense.id}
                className="group flex flex-col gap-4 rounded-xl border bg-white p-4 transition hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      style.iconBox,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {expense.description}
                      </p>

                      <Badge
                        variant="outline"
                        className={cn("rounded-full", style.badge)}
                      >
                        {style.label}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{expense.category}</span>

                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(expense.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p
                    className={cn(
                      "min-w-28 text-right text-base font-bold",
                      style.amount,
                    )}
                  >
                    {style.signal}
                    {formatCurrency(expense.value)}
                  </p>

                  <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                    <EditExpenseDialog expense={expense} />

                    <button
                      type="button"
                      title="Excluir lançamento"
                      disabled={isDeleting}
                      onClick={() => handleDelete(expense)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      disabled
                      title="Mais opções"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardWidget>
  );
}