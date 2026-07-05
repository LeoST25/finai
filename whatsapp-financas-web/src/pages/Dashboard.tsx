import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorState } from "@/shared/feedback/error-state";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";

import { getDashboardSummary } from "@/features/dashboard/dashboard-summary";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

import { CreateExpenseForm } from "@/features/expenses/components/create-expense-form";

import {
  DashboardActionsWidget,
  DashboardChartsWidget,
  DashboardInsightsWidget,
  DashboardKpisWidget,
  DashboardTransactionsWidget,
} from "@/features/dashboard/widgets";

export function Dashboard() {
  const { data = [], isLoading, error } = useExpenses();

  const summary = getDashboardSummary(data);

  if (isLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
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
        <DashboardHeader />

        <DashboardKpisWidget summary={summary} />

        <DashboardInsightsWidget expenses={data} />

        <DashboardActionsWidget />

        <CreateExpenseForm />

        <DashboardTransactionsWidget expenses={data} />

        <DashboardChartsWidget expenses={data} />
      </div>
    </AppLayout>
  );
}