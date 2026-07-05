import { Receipt } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/shared/feedback/empty-state";
import { DashboardWidget } from "@/shared/ui/components/dashboard-widget";

type Props = {
  expenses: Expense[];
};

export function LatestTransactions({ expenses }: Props) {
  const latest = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

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
        <div className="space-y-4">
          {latest.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-slate-500">
                  {expense.category}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={
                    expense.type === "income"
                      ? "font-bold text-emerald-600"
                      : "font-bold text-red-600"
                  }
                >
                  {expense.type === "income" ? "+" : "-"} R${" "}
                  {expense.value.toFixed(2)}
                </p>

                <Badge variant="outline">
                  {expense.type === "income"
                    ? "Receita"
                    : "Despesa"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardWidget>
  );
}