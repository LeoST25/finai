import { Suspense, lazy, useMemo, useState } from "react";
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

const CategoryChart = lazy(() =>
  import("@/features/dashboard/components/category-chart").then((module) => ({
    default: module.CategoryChart,
  })),
);

const MonthlyChart = lazy(() =>
  import("@/features/dashboard/components/monthly-chart").then((module) => ({
    default: module.MonthlyChart,
  })),
);

function ChartLoader() {
  return (
    <div className="min-h-[320px] rounded-2xl border bg-white p-5 text-sm text-slate-500 sm:p-6">
      Carregando gráfico...
    </div>
  );
}

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
      <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
        <section className="flex flex-col gap-5 rounded-2xl border bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Relatórios
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Analise padrões, categorias, tendências e insights das suas
              finanças.
            </p>
          </div>

          <div className="grid gap-2 sm:flex sm:items-center">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm sm:w-auto"
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
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </section>

        <Card className="rounded-2xl">
          <CardContent className="flex flex-col gap-1 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
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
          <div className="rounded-2xl border bg-white p-5 text-sm text-slate-500 sm:p-6">
            Carregando relatórios...
          </div>
        ) : (
          <>
            <DashboardKpisWidget summary={summary} />

            <DashboardInsightsWidget expenses={filteredExpenses} />

            <Suspense fallback={<ChartLoader />}>
              <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
                <CategoryChart expenses={filteredExpenses} />
                <MonthlyChart expenses={filteredExpenses} />
              </div>
            </Suspense>
          </>
        )}
      </div>
    </AppLayout>
  );
}