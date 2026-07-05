import { DashboardKpisWidget } from "@/features/dashboard/widgets/dashboard-kpis-widget";
import { DashboardInsightsWidget } from "@/features/dashboard/widgets/dashboard-insights-widget";
import { DashboardActionsWidget } from "@/features/dashboard/widgets/dashboard-actions-widget";
import { DashboardTransactionsWidget } from "@/features/dashboard/widgets/dashboard-transactions-widget";
import { DashboardChartsWidget } from "@/features/dashboard/widgets/dashboard-charts-widget";

export function Dashboard() {
  const { data = [], isLoading, error } = useExpenses();

  const summary = getDashboardSummary(data);

  return (
    <AppLayout>
      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className="space-y-6">
          <DashboardHeader />

          <DashboardKpis summary={summary} />

          <AiInsights expenses={data} />

          <QuickActions />

          <CreateExpenseForm />

          <LatestTransactions expenses={data} />

          <div className="grid gap-4 lg:grid-cols-2">
            <CategoryChart expenses={data} />
            <MonthlyChart expenses={data} />
          </div>
        </div>
      )}
    </AppLayout>
  );
}