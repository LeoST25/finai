import { Receipt } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import { ExpenseListItem } from "@/features/expenses/components/expense-list-item";
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
        <div className="space-y-3">
          {latest.map((expense) => (
            <ExpenseListItem
              key={expense.id}
              expense={expense}
              actionsVisibility="hover"
            />
          ))}
        </div>
      )}
    </DashboardWidget>
  );
}