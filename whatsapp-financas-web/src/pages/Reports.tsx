import { useMemo, useState } from "react";
import { CalendarDays, RotateCcw } from "lucide-react";

import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorState } from "@/shared/feedback/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import {
  filterExpenses,
  type ExpensePeriodFilter,
} from "@/features/expenses/utils/expense-filters";

import { getDashboardSummary } from "@/features/dashboard/dashboard-summary";
import {
  DashboardInsightsWidget,
  DashboardKpisWidget,
} from "@/features/dashboard/widgets";
import { CategoryChart } from "@/features/dashboard/components/category-chart";
import { MonthlyChart } from "@/features/dashboard/components/monthly-chart";

export function Reports() {
  const { data = [], isLoading, error } = useExpenses();

  const [period, setPeriod] = useState<ExpensePeriodFilter>("all");

  const filteredExpenses = useMemo(
    () =>
      filterExpenses(data, {
        search: "",
        type: "all",
        category: "all",
        period,
      }),
    [data, period],
  );

  const summary = useMemo(
    () => getDashboardSummary(filteredExpenses),
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
              Relatórios
            </h1>

            <p className="mt-1 text-slate-500">
              Analise padrões, categorias, tendências e insights das suas
              finanças.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                className="h-10 rounded-md border bg-background pl-9 pr-3 text-sm"
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value as ExpensePeriodFilter)
                }
              >
                <option value="all">Todos os períodos</option>
                <option value="today">Hoje</option>
                <option value="last7days">Últimos 7 dias</option>
                <option value="last30days">Últimos 30 dias</option>
                <option value="currentMonth">Mês atual</option>
              </select>
            </div>

            {period !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPeriod("all")}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </section>

        <Card>
          <CardContent className="flex flex-col gap-1 p-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-slate-700">
              Lançamentos analisados
            </p>

            <p className="text-sm text-slate-500">
              {filteredExpenses.length} de {data.length} lançamentos
              considerados neste relatório.
            </p>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
            Carregando relatórios...
          </div>
        ) : (
          <>
            <DashboardKpisWidget summary={summary} />

            <DashboardInsightsWidget expenses={filteredExpenses} />

            <div className="grid gap-6 xl:grid-cols-2">
              <CategoryChart expenses={filteredExpenses} />
              <MonthlyChart expenses={filteredExpenses} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}