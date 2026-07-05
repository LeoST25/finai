import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorState } from "@/shared/feedback/error-state";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { getDashboardSummary } from "@/features/dashboard/dashboard-summary";

import { DashboardKpisWidget } from "@/features/dashboard/widgets";
import { DashboardInsightsWidget } from "@/features/dashboard/widgets";
import { CategoryChart } from "@/features/dashboard/components/category-chart";
import { MonthlyChart } from "@/features/dashboard/components/monthly-chart";

export function Reports() {
  const { data = [], isLoading, error } = useExpenses();

  const summary = getDashboardSummary(data);

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
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight">
            Relatórios
          </h1>

          <p className="mt-1 text-slate-500">
            Analise padrões, categorias, tendências e insights das suas
            finanças.
          </p>
        </section>

        {isLoading ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
            Carregando relatórios...
          </div>
        ) : (
          <>
            <DashboardKpisWidget summary={summary} />

            <DashboardInsightsWidget expenses={data} />

            <div className="grid gap-6 xl:grid-cols-2">
              <CategoryChart expenses={data} />
              <MonthlyChart expenses={data} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}