import { Suspense, lazy } from "react";

import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorState } from "@/shared/feedback/error-state";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { getDashboardSummary } from "@/features/dashboard/dashboard-summary";
import { analyzeFinancialData } from "@/features/dashboard/ai/financial-analyzer";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

import { useGoals } from "@/features/goals/hooks";

import {
  DashboardActionsWidget,
  DashboardAiWidget,
  DashboardKpisWidget,
  DashboardTransactionsWidget,
  DashboardGoalsWidget,
} from "@/features/dashboard/widgets";

const DashboardChartsWidget = lazy(() =>
  import("@/features/dashboard/widgets").then((module) => ({
    default: module.DashboardChartsWidget,
  })),
);

function DashboardChartsLoader() {
  return (
    <div className="min-h-80 rounded-2xl border bg-white p-5 text-sm text-slate-500 sm:p-6">
      Carregando gráficos...
    </div>
  );
}

export function Dashboard() {
  const { data = [], isLoading, error } = useExpenses();
  const { goals, alerts, isLoading: goalsLoading, isError: goalsError } = useGoals();

  const summary = getDashboardSummary(data);
  const financialAnalysis = analyzeFinancialData(data, goals);

  if (isLoading || goalsLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (error || goalsError) {
    return (
      <AppLayout>
        <ErrorState />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
        <DashboardHeader
          user={{
            name: "Leonardo",
          }}
        />

        <DashboardKpisWidget summary={summary} />

        <DashboardAiWidget analysis={financialAnalysis} />

        <DashboardActionsWidget />

        <DashboardGoalsWidget goals={goals} alerts={alerts} isLoading={goalsLoading} />

        <DashboardTransactionsWidget expenses={data} />

        <Suspense fallback={<DashboardChartsLoader />}>
          <DashboardChartsWidget expenses={data} />
        </Suspense>
      </div>
    </AppLayout>
  );
}