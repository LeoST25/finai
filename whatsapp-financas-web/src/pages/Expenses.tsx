import { useMemo, useState } from "react";

import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorState } from "@/shared/feedback/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { CreateExpenseDialog } from "@/features/expenses/components/create-expense-dialog";
import { ExpensesList } from "@/features/expenses/components/expenses-list";
import { ExpensesSummary } from "@/features/expenses/components/expense-summary";
import { getExpensesSummary } from "@/features/expenses/utils/expense-summary";
import {
  filterExpenses,
  getExpenseCategories,
} from "@/features/expenses/utils/expense-filters";

export function Expenses() {
  const { data = [], isLoading, error } = useExpenses();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => getExpenseCategories(data), [data]);

  const filteredExpenses = useMemo(
    () =>
      filterExpenses(data, {
        search,
        type,
        category,
      }),
    [data, search, type, category],
  );

  const summary = useMemo(
    () => getExpensesSummary(filteredExpenses),
    [filteredExpenses],
  );

  if (error) {
    return (
      <AppLayout>
        <ErrorState />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-3xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lançamentos
            </h1>

            <p className="mt-1 text-slate-500">
              Consulte, filtre, edite e exclua suas receitas e despesas.
            </p>
          </div>

          <CreateExpenseDialog
            triggerLabel="Novo lançamento"
            triggerVariant="default"
          />
        </section>

        <ExpensesSummary summary={summary} />

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Buscar por descrição ou categoria"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>

              <select
                className="h-10 rounded-md border bg-background px-3 text-sm"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">Todas as categorias</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <ExpensesList
          expenses={filteredExpenses}
          isLoading={isLoading}
          total={data.length}
        />
      </div>
    </AppLayout>
  );
}