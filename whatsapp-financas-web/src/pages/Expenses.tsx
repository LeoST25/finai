import { useMemo, useState } from "react";

import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorState } from "@/shared/feedback/error-state";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { CreateExpenseDialog } from "@/features/expenses/components/create-expense-dialog";
import { ExpensesList } from "@/features/expenses/components/expenses-list";
import { ExpensesSummary } from "@/features/expenses/components/expense-summary";
import { ExpensesFilters } from "@/features/expenses/components/expense-filters";
import { getExpensesSummary } from "@/features/expenses/utils/expense-summary";
import {
  filterExpenses,
  getExpenseCategories,
} from "@/features/expenses/utils/expense-filters";

type ExpenseFilterType = "all" | "income" | "expense";

export function Expenses() {
  const { data = [], isLoading, error } = useExpenses();

  const [search, setSearch] = useState("");
  const [type, setType] = useState<ExpenseFilterType>("all");
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

  function handleClearFilters() {
    setSearch("");
    setType("all");
    setCategory("all");
  }

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

        <ExpensesFilters
          search={search}
          type={type}
          category={category}
          categories={categories}
          total={data.length}
          filteredTotal={filteredExpenses.length}
          onSearchChange={setSearch}
          onTypeChange={setType}
          onCategoryChange={setCategory}
          onClearFilters={handleClearFilters}
        />

        <ExpensesList
          expenses={filteredExpenses}
          isLoading={isLoading}
          total={data.length}
        />
      </div>
    </AppLayout>
  );
}