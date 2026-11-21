import { Receipt } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/shared/feedback/empty-state";
import { ExpenseListItem } from "./expense-list-item";

type ExpensesListProps = {
  expenses: Expense[];
  isLoading: boolean;
  total: number;
};

export function ExpensesList({
  expenses,
  isLoading,
  total,
}: ExpensesListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-slate-500">
            Carregando lançamentos...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <CardTitle>Lançamentos encontrados: {expenses.length}</CardTitle>

        <p className="text-sm text-slate-500">
          Total cadastrado: {total}
        </p>
      </CardHeader>

      <CardContent>
        {expenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nenhum lançamento encontrado"
            description="Ajuste os filtros ou cadastre uma nova receita ou despesa."
          />
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <ExpenseListItem key={expense.id} expense={expense} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}